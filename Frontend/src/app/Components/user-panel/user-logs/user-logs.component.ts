import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface AttendanceEntry {
  id?: number;
  date: string;
  time_in: string | null;
  time_out: string | null;
}

interface DayData {
  date: Date;
  entries: AttendanceEntry[];
  status: 'On Time' | 'Late' | 'Absent';
  totalHours: string;
}

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.css']
})
export class UserLogsComponent implements OnInit {
  attendanceData: AttendanceEntry[] = [];
  allDateRange: DayData[] = [];
  filteredDateRange: DayData[] = [];
  selectedDate: Date | null = null;
  isLoading: boolean = true;
  userId: number | null = null;
  itemsPerPage: number = 10;
  currentPage: number = 1;
  
  today = new Date();
  startDate = new Date(2025, 2, 1); // March 1, 2025
  rangeForm: FormGroup;
  showInvalidRangeError = false;
  
  showFilter = false;
  filteredRangeText = '';
  timeZone = 'Asia/Kolkata'; // India timezone

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) { 
    // Set dates to India timezone
    this.today = this.convertToIST(new Date());
    this.startDate = this.convertToIST(new Date(2025, 2, 1));
    this.today.setHours(0, 0, 0, 0);
    this.startDate.setHours(0, 0, 0, 0);

    this.rangeForm = this.fb.group({
      startDate: [this.startDate, Validators.required],
      endDate: [this.today, Validators.required]
    });
  }

  ngOnInit() {

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.userId = parseInt(userId);
    this.loadAttendanceData();
  }

  // Convert any date to India timezone
  convertToIST(date: Date): Date {
    return new Date(date.toLocaleString('en-US', { timeZone: this.timeZone }));
  }

  formatRangeText(start: Date, end: Date): string {
    const startDate = this.convertToIST(new Date(start));
    const endDate = this.convertToIST(new Date(end));
    
    const optionsSameMonth: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric' 
    };
    
    const optionsSameYear: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric' 
    };
    
    const optionsWithYear: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    };

    if (startDate.getMonth() === endDate.getMonth() && 
        startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.toLocaleDateString('en-US', optionsSameMonth)} - 
              ${endDate.getDate()}, ${endDate.getFullYear()}`;
    }
    else if (startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.toLocaleDateString('en-US', optionsSameYear)} - 
              ${endDate.toLocaleDateString('en-US', optionsWithYear)}`;
    }
    else {
      return `${startDate.toLocaleDateString('en-US', optionsWithYear)} - 
              ${endDate.toLocaleDateString('en-US', optionsWithYear)}`;
    }
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  applyFilter() {
    const { startDate, endDate } = this.rangeForm.value;
    this.filterByDateRange(startDate, endDate);
    
    if (!this.showInvalidRangeError) {
      this.filteredRangeText = this.formatRangeText(startDate, endDate);
    }
    
    this.showFilter = false;
  }

  resetFilter() {
    this.rangeForm.patchValue({
      startDate: this.startDate,
      endDate: this.today
    });
    this.applyFilter();
    this.filteredRangeText = '';
  }

  filterByDateRange(start: Date, end: Date) {
    const startDate = this.convertToIST(new Date(start));
    const endDate = this.convertToIST(new Date(end));
    
    if (startDate < this.startDate || endDate < this.startDate) {
      this.showInvalidRangeError = true;
      return;
    }
    
    this.showInvalidRangeError = false;
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    this.filteredDateRange = this.allDateRange.filter(day => {
      const dayDate = this.convertToIST(new Date(day.date));
      return dayDate >= startDate && dayDate <= endDate;
    });
    
    // Ensure filtered results are also sorted
    this.filteredDateRange.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  loadAttendanceData() {
    if (!this.userId) return;

    this.userService.getUserAttendance(this.userId).subscribe({
      next: (data: AttendanceEntry[]) => {
        this.attendanceData = data.map(entry => ({
          ...entry,
          date: this.normalizeDate(entry.date)
        }));
        this.generateDateRange();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading attendance data:', err);
        this.isLoading = false;
      }
    });
  }

  normalizeDate(dateString: string): string {
    const date = new Date(dateString);
    const indiaDate = this.convertToIST(date);
    return new Date(
      indiaDate.getFullYear(),
      indiaDate.getMonth(),
      indiaDate.getDate()
    ).toISOString();
  }

  generateDateRange() {
    this.allDateRange = [];
    const currentDate = new Date(this.startDate);
    
    while (currentDate <= this.today) {
      const entriesForDate = this.attendanceData.filter((entry: AttendanceEntry) => {
        const entryDate = this.convertToIST(new Date(entry.date));
        const currentDateIST = this.convertToIST(new Date(currentDate));
        
        return (
          entryDate.getFullYear() === currentDateIST.getFullYear() &&
          entryDate.getMonth() === currentDateIST.getMonth() &&
          entryDate.getDate() === currentDateIST.getDate()
        );
      });
      
      this.allDateRange.push({
        date: new Date(currentDate),
        entries: entriesForDate,
        status: this.calculateStatus(entriesForDate),
        totalHours: this.calculateTotalHours(entriesForDate)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    this.sortDateRangeDescending();
  }

  calculateTotalHours(entries: AttendanceEntry[]): string {
    if (entries.length === 0) return '0h 0m';

    let totalMinutes = 0;

    entries.forEach(entry => {
      if (entry.time_in && entry.time_out) {
        const [inHours, inMinutes] = entry.time_in.split(':').map(Number);
        const [outHours, outMinutes] = entry.time_out.split(':').map(Number);
        
        const inTotal = inHours * 60 + inMinutes;
        const outTotal = outHours * 60 + outMinutes;
        
        totalMinutes += (outTotal - inTotal);
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  calculateStatus(entries: AttendanceEntry[]): 'On Time' | 'Late' | 'Absent' {
    if (entries.length === 0) return 'Absent';
    
    const earliestEntry = entries.reduce((earliest: AttendanceEntry | null, current: AttendanceEntry) => {
      if (!current.time_in) return earliest;
      if (!earliest) return current;
      
      const currentTime = new Date(`1970-01-01T${current.time_in}Z`);
      const earliestTime = new Date(`1970-01-01T${earliest.time_in}Z`);
      
      return currentTime < earliestTime ? current : earliest;
    }, null);
    
    if (!earliestEntry || !earliestEntry.time_in) return 'Absent';
    
    const checkInTime = new Date(`1970-01-01T${earliestEntry.time_in}Z`);
    const onTimeThreshold = new Date(`1970-01-01T09:00:00Z`); // 9 AM IST
    
    return checkInTime <= onTimeThreshold ? 'On Time' : 'Late';
  }

  getEntriesForSelectedDate(): AttendanceEntry[] {
    if (!this.selectedDate) return [];
    
    const dayData = this.allDateRange.find(day => 
      day.date.getTime() === this.selectedDate!.getTime()
    );
    
    return dayData ? dayData.entries : [];
  }

  openDateDetails(date: Date) {
    this.selectedDate = date;
  }

  closeDetails() {
    this.selectedDate = null;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-IN', { 
      timeZone: this.timeZone,
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  calculateEntryHours(timeIn: string, timeOut: string): string {
    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);
    
    const inTotal = inHours * 60 + inMinutes;
    const outTotal = outHours * 60 + outMinutes;
    
    const totalMinutes = outTotal - inTotal;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  }
  
  getTotalHoursForSelectedDate(): string {
    if (!this.selectedDate) return '0h 0m';
    const dayData = this.allDateRange.find(day => 
      day.date.getTime() === this.selectedDate!.getTime()
    );
    return dayData ? dayData.totalHours : '0h 0m';
  }
  
  getDisplayedRange(): string {
    const totalEntries = this.filteredDateRange.length;
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, totalEntries);
    return `${start} to ${end} of ${totalEntries} entries`;
  }

  sortDateRangeDescending() {
    this.allDateRange.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    this.filteredDateRange = [...this.allDateRange];
  }

  getFirstInTime(entries: AttendanceEntry[]): string | null {
    if (!entries || entries.length === 0) return null;
    
    // Filter out entries without time_in and sort by time_in
    const validEntries = entries.filter(entry => entry.time_in !== null);
    if (validEntries.length === 0) return null;
    
    // Sort by time_in and get the earliest
    validEntries.sort((a, b) => a.time_in!.localeCompare(b.time_in!));
    return validEntries[0].time_in;
  }
  
  getLastOutTime(entries: AttendanceEntry[]): string | null {
    if (!entries || entries.length === 0) return null;
    
    // Filter out entries without time_out and sort by time_out
    const validEntries = entries.filter(entry => entry.time_out !== null);
    if (validEntries.length === 0) return null;
    
    // Sort by time_out and get the latest
    validEntries.sort((a, b) => b.time_out!.localeCompare(a.time_out!));
    return validEntries[0].time_out;
  }
}