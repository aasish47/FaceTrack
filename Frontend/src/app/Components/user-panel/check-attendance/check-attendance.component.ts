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
            const minTimeIn = this.getMinTime(records.map((r: any) => r.time_in));
            const maxTimeOut = this.getMaxTime(records.map((r: any) => r.time_out));

            this.status = this.calculateStatus(minTimeIn);
            this.hoursWorked = this.calculateHours(minTimeIn, maxTimeOut);
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
    const lateThreshold = new Date('1970-01-01T09:30:00'); // Adjust based on policy
    return loginTime > lateThreshold ? 'Late' : 'Present';
  }

  calculateHours(timeIn: string, timeOut: string): string {
    if (
      !timeIn ||
      !timeOut ||
      timeIn === '00:00:00' ||
      timeOut === '00:00:00'
    ) {
      return '-'; // Absent or invalid time
    }

    const inTime = new Date(`1970-01-01T${timeIn}Z`);
    const outTime = new Date(`1970-01-01T${timeOut}Z`);
    const hours = (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60); // Convert to hours

    return hours.toFixed(2); // Display as "X.XX" hours
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
