import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartType, registerables } from 'chart.js';
import { UserService } from 'src/app/services/user.service';

Chart.register(...registerables);

@Component({
  selector: 'app-monthly-chart',
  templateUrl: './monthly-chart.component.html',
  styleUrls: ['./monthly-chart.component.css']
})
export class MonthlyChartComponent {
  userId = Number(sessionStorage.getItem('userId'));
  months: { name: string }[] = [];

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    this.setupMonths(); // Initialize the months to be displayed in the chart
    this.fetchAttendanceData(); // Fetch attendance data for the user
  }

  setupMonths() {
    const today = new Date();
    for (let i = 3; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      // Generate last four months dynamically for display
      this.months.push({ name: date.toLocaleString('en-US', { month: 'short', year: 'numeric' }) });
    }
  }

  fetchAttendanceData() {
    this.userService.getUserAttendance(this.userId).subscribe({
      next: (data) => {
        const monthlyHours = this.calculateMonthlyHours(data); // Process attendance data
        this.renderChart(monthlyHours); // Render chart with computed data
      },
      error: (error) => {
        console.error('Error fetching attendance data', error);
      }
    });
  }

  calculateMonthlyHours(data: any[]): number[] {
    const monthlyHours: number[] = [0, 0, 0, 0];
    const today = new Date();
    const groupedByDate: { [key: string]: { time_in: string[], time_out: string[] } } = {};

    // Group attendance records by date to consolidate multiple logs
    data.forEach(record => {
      if (!groupedByDate[record.date]) {
        groupedByDate[record.date] = { time_in: [], time_out: [] };
      }
      groupedByDate[record.date].time_in.push(record.time_in);
      groupedByDate[record.date].time_out.push(record.time_out);
    });

    for (let i = 3; i >= 0; i--) {
      const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      Object.keys(groupedByDate).forEach(dateStr => {
        const recordDate = new Date(dateStr);
        if (recordDate >= start && recordDate <= end) {
          const timeIns = groupedByDate[dateStr].time_in;
          const timeOuts = groupedByDate[dateStr].time_out;
          const totalHours = this.calculateTotalHours(timeIns, timeOuts);
          monthlyHours[3 - i] += totalHours;
        }
      });
    }

    return monthlyHours;
  }

  calculateTotalHours(timeIns: string[], timeOuts: string[]): number {
    if (timeIns.length === 0 || timeOuts.length === 0) return 0;
    // Sum all time-in timestamps to compute total working hours
    const totalTimeIn = timeIns.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    const totalTimeOut = timeOuts.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    return (totalTimeOut - totalTimeIn) / (1000 * 60 * 60); // Convert milliseconds to hours
  }

  renderChart(hoursWorked: number[]) {
    const ctx = document.getElementById('monthlyHoursChart') as HTMLCanvasElement;
    
    const colors = {
      low: '#E03C32',  // Red (< 144 hrs) - Below Standard
      mid: '#FFD301',  // Yellow (144-160 hrs) - Meeting Target
      high: '#639754'  // Green (> 160 hrs) - Exceeding Target
    };

    // Assign colors based on the total hours worked
    const backgroundColors = hoursWorked.map(hours => {
      if (hours < 144) return colors.low;
      if (hours < 160) return colors.mid;
      return colors.high;
    });

    new Chart(ctx, {
      type: 'bar' as ChartType,
      data: {
        labels: this.months.map(month => month.name), // Assign months to the X-axis
        datasets: [{
          label: 'Total Hours Worked',
          data: hoursWorked,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              boxWidth: 15,
              usePointStyle: true,
              generateLabels: function () {
                return [
                  { text: "Below Standard", fillStyle: colors.low },
                  { text: "Meeting Target", fillStyle: colors.mid },
                  { text: "Exceeding Target", fillStyle: colors.high }
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Hours Worked' },
            ticks: {
              stepSize: 20
            }
          },
          x: {
            title: { display: true, text: 'Months' }
          }
        }
      }
    });
  }
}

