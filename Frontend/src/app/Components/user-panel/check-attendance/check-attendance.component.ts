import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-check-attendance',
  templateUrl: './check-attendance.component.html',
  styleUrls: ['./check-attendance.component.css']
})
export class CheckAttendanceComponent {
  userId = Number(sessionStorage.getItem('userId'));
  selectedDate: string = '';
  attendanceRecord: any = null;
  status: string = '';
  hoursWorked: string = '-'; // Default when absent

  constructor(private userService: UserService) {}

  fetchAttendanceStats() {
    if (this.selectedDate) {
      this.userService.getUserAttendance(this.userId).subscribe({
        next: (data) => {
          const records = data.filter(
            (entry: any) => entry.date === this.selectedDate
          );

          if (records.length > 0) {
            const timeIns = records.map((r: any) => r.time_in);
            const timeOuts = records.map((r: any) => r.time_out);
            
            const minTimeIn = this.getMinTime(timeIns);
            const maxTimeOut = this.getMaxTime(timeOuts);

            this.status = this.calculateStatus(minTimeIn);
            this.hoursWorked = this.calculateTotalWorkedHours(timeIns, timeOuts);
            this.attendanceRecord = { time_in: minTimeIn, time_out: maxTimeOut };
          } else {
            this.status = 'Absent';
            this.hoursWorked = '-';
            this.attendanceRecord = { time_in: '-', time_out: '-' };
          }
        },
        error: (error) => {
          console.error('Error fetching attendance stats', error);
        },
      });
    }
  }

  getMinTime(times: string[]): string {
    return times.filter(t => t !== '00:00:00').sort()[0] || '00:00:00';
  }

  getMaxTime(times: string[]): string {
    return times.filter(t => t !== '00:00:00').sort().reverse()[0] || '00:00:00';
  }

  calculateStatus(timeIn: string): string {
    if (!timeIn || timeIn === '00:00:00') return 'Absent';
    const loginTime = new Date(`1970-01-01T${timeIn}`);
    const lateThreshold = new Date('1970-01-01T09:00:00'); // Adjust based on policy
    return loginTime > lateThreshold ? 'Late' : 'Present';
  }

  calculateTotalWorkedHours(timeIns: string[], timeOuts: string[]): string {
    if (timeIns.length === 0 || timeOuts.length === 0) return '-';
    
    const totalTimeIn = timeIns.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    const totalTimeOut = timeOuts.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    
    return ((totalTimeOut - totalTimeIn) / (1000 * 60 * 60)).toFixed(2); // Convert to hours
  }
  
  getStatusClass(): string {
    switch (this.status) {
      case 'Present':
        return 'status-present';
      case 'Late':
        return 'status-late';
      case 'Absent':
        return 'status-absent';
      default:
        return '';
    }
  }
}
