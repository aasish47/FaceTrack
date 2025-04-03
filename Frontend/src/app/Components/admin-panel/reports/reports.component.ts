import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

interface AttendanceRecord {
  userId: string;
  userName: string;
  date: string;
  time_in: string;
  time_out: string;
  status: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [DatePipe]
})
export class ReportsComponent implements OnInit {
  startDate: string;
  endDate: string;
  employeeId: string = '';
  attendanceData: AttendanceRecord[] = [];
  isLoading: boolean = false;

  // API endpoints
  private attendanceApiUrl = 'http://localhost:8000/DetailsAdminPanel/attendance-summary/';
  private usersApiUrl = 'http://localhost:8000/Registration/user/';

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    // Set default date range (last 7 days)
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    
    this.startDate = this.formatDate(start);
    this.endDate = this.formatDate(end);
  }

  ngOnInit(): void {
    this.fetchAttendanceData();
  }

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  fetchAttendanceData(): void {
    this.isLoading = true;
    const params: any = {
      start_date: this.startDate,
      end_date: this.endDate
    };

    if (this.employeeId) {
      params.user_id = this.employeeId;
    }

    this.http.get<AttendanceRecord[]>(this.attendanceApiUrl, { params }).subscribe({
      next: (data) => {
        this.attendanceData = data;
        this.isLoading = false;
        console.log(this.attendanceData);
      },
      error: (error) => {
        console.error('Error fetching attendance data:', error);
        this.isLoading = false;
        alert('Failed to fetch attendance data');
      }
    });
  }
  

  exportToCSV(): void {
    if (!this.attendanceData.length) {
      alert('No data to export!');
      return;
    }

    // Convert to CSV format with proper escaping
    const headers = ['User ID', 'Name', 'Date', 'Check-In', 'Check-Out', 'Status', 'Hours Worked'];
    const csvRows = this.attendanceData.map(record => {
      const hours = this.calculateHours(record.time_in, record.time_out);
      return `"${record.userId}","${record.userName}","${record.date}","${record.time_in}","${record.time_out}","${record.status}","${hours}"`;
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    this.downloadFile(csvContent, 'text/csv', `attendance_report_${this.startDate}_to_${this.endDate}.csv`);
  }

  exportToPDF(): void {
    if (!this.attendanceData.length) {
      alert('No data to export!');
      return;
    }

    const printContent = this.generatePrintableHTML();
    const blob = new Blob([printContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 500);
    };
  }

  private calculateHours(timeIn: string, timeOut: string): string {
    if (timeIn === '00:00:00' || timeOut === '00:00:00') return '0h';
    
    const [inH, inM] = timeIn.split(':').map(Number);
    const [outH, outM] = timeOut.split(':').map(Number);
    
    const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  }

  private downloadFile(data: string, mimeType: string, filename: string) {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }

  private generatePrintableHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Attendance Report (${this.startDate} to ${this.endDate})</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #2c3e50; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #4a6cf7; color: white; }
          tr:nth-child(even) { background-color: #f8f9fa; }
          .header { display: flex; justify-content: space-between; }
          .report-info { margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Attendance Report</h1>
          <div class="report-info">
            <p><strong>Date Range:</strong> ${this.startDate} to ${this.endDate}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            ${this.attendanceData.map(record => `
              <tr>
                <td>${record.userId}</td>
                <td>${record.userName}</td>
                <td>${record.date}</td>
                <td>${record.time_in}</td>
                <td>${record.time_out}</td>
                <td>${record.status}</td>
                <td>${this.calculateHours(record.time_in, record.time_out)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
  }
}