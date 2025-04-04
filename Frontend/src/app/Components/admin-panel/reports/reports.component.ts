import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { Chart, TooltipItem } from 'chart.js';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  dailyDate: string = '';
  trendStartDate: string = '';
  trendEndDate: string = '';
  trendData: any[] = [];
  averagePresence: number = 0;
  bestDay: any = { date: '', percentage: 0 };
  worstDay: any = { date: '', percentage: 100 };
  private chart: any;
  totalStrength: number = 0;

  @ViewChild('trendChart') trendChart!: ElementRef;

  private userApi = 'http://localhost:8000/Registration/user/';
  private attendanceApi = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-summary/';
  private trendsApi = 'http://127.0.0.1:8000/DetailsAdminPanel/attendance-monthly-summary/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.setDefaultDates();
    this.fetchTotalStrength();
  }

  private fetchTotalStrength() {
    this.http.get<any[]>(this.userApi).subscribe(users => {
        this.totalStrength = users.length;
        // if (this.trendStartDate && this.trendEndDate) {
        //     this.loadTrendData();
        // }
    });
  }

  private setDefaultDates() {
    const today = new Date();
    this.dailyDate = this.formatDate(today);
    this.trendStartDate = this.formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
    this.trendEndDate = this.formatDate(today);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  exportRegisteredUsers() {
    this.http.get<any[]>(this.userApi).subscribe(users => {
      const data = users.map(user => ({
        ID: user.userId,
        Name: user.userName,
        Email: user.userEmail,
        Department: user.department,
        Position: user.position,
        Registered: user.registrationDate
      }));
      this.exportToExcel(data, 'Registered_Users');
    });
  }

  exportDailyAttendance() {
    if (!this.dailyDate) return;

    const url = `${this.attendanceApi}?date=${this.dailyDate}`;
    this.http.get<any>(url).subscribe(data => {
      const reportData = [
        ...data.on_time_users.map((user: any) => ({
          ID: user.userId,
          Name: user.userName,
          Status: 'Present (On Time)',
          CheckIn: user.checkInTime || 'N/A',
          CheckOut: user.checkOutTime || 'N/A'
        })),
        ...data.late_users.map((user: any) => ({
          ID: user.userId,
          Name: user.userName,
          Status: 'Present (Late)',
          CheckIn: user.checkInTime || 'N/A',
          CheckOut: user.checkOutTime || 'N/A'
        })),
        ...data.absent_users.map((user: any) => ({
          ID: user.userId,
          Name: user.userName,
          Status: 'Absent',
          CheckIn: 'N/A',
          CheckOut: 'N/A'
        }))
      ];

      this.exportToExcel(reportData, `Daily_Attendance_${this.dailyDate}`);
    });
  }

  loadTrendData() {
    if (!this.trendStartDate || !this.trendEndDate) return;

    const url = `${this.trendsApi}?start_date=${this.trendStartDate}&end_date=${this.trendEndDate}`;
    this.http.get<any[]>(url).subscribe(data => {
      this.trendData = data;
      this.calculateTrendStats();
      this.renderTrendChart();
    });
  }

  private calculateTrendStats() {
    let totalPresence = 0;
    let totalDays = 0;

    this.trendData.forEach(day => {
      const present = day.present;
      const absent = this.totalStrength - present;
      const total = this.totalStrength;

      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      totalPresence += percentage;
      totalDays++;

      if (percentage > this.bestDay.percentage) {
        this.bestDay = { date: day.date, percentage };
      }

      if (percentage < this.worstDay.percentage) {
        this.worstDay = { date: day.date, percentage };
      }
    });

    this.averagePresence = totalDays > 0 ? Math.round(totalPresence / totalDays) : 0;
  }


  private renderTrendChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.trendData.map(item => item.date);
    const presentData = this.trendData.map(item => item.present);
    const absentData = this.trendData.map(item => item.absent);
    const percentageData = this.trendData.map(item => {
      const total = this.totalStrength;
      return total > 0 ? (item.present / total) * 100 : 0;
    });

    this.chart = new Chart(this.trendChart.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Present Employees',
            data: presentData,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Absent Employees',
            data: absentData,
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            borderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Presence Percentage',
            data: percentageData,
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            borderWidth: 2,
            type: 'line',
            yAxisID: 'y1',
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          title: {
            display: true,
            text: 'Attendance Trend Analysis'
          },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'line'>) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.datasetIndex === 2) {
                  // For percentage dataset
                  const rawValue = context.raw as number;
                  label += rawValue.toFixed(1) + '%';
                } else {
                  // For other datasets
                  const rawValue = context.raw as number;
                  label += rawValue.toString();
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Number of Employees'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            min: 0,
            max: 100,
            title: {
              display: true,
              text: 'Percentage (%)'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }
  exportTrendReport() {
    if (this.trendData.length === 0) return;

    const reportData = this.trendData.map(item => {
      const present = item.present;
      const total = this.totalStrength;
      const absent = total-present;
      const percentage = total > 0 ? (present / total) * 100 : 0;

      return {
        Date: item.date,
        Present: present,
        Absent: absent,
        'Total Employees': total,
        'Presence Percentage': percentage.toFixed(1) + '%',
        'Status': percentage >= 80 ? 'Good' : percentage >= 60 ? 'Average' : 'Poor'
      };
    });

    // Add summary data
    const summaryData = [
      {},
      { Date: 'SUMMARY', Present: '', Absent: '', 'Total Employees': '', 'Presence Percentage': '', 'Status': '' },
      { Date: 'Average Presence', Present: '', Absent: '', 'Total Employees': '', 'Presence Percentage': this.averagePresence + '%', 'Status': '' },
      { Date: 'Best Day', Present: '', Absent: '', 'Total Employees': '', 'Presence Percentage': this.bestDay.percentage + '%', 'Status': this.bestDay.date },
      { Date: 'Worst Day', Present: '', Absent: '', 'Total Employees': '', 'Presence Percentage': this.worstDay.percentage + '%', 'Status': this.worstDay.date }
    ];

    this.exportToExcel([...reportData, ...summaryData], `Attendance_Trend_${this.trendStartDate}_to_${this.trendEndDate}`);
  }

  private exportToExcel(data: any[], fileName: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}