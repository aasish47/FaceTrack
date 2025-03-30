import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartType, registerables } from 'chart.js';
import { UserService } from 'src/app/services/user.service';

Chart.register(...registerables);

@Component({
  selector: 'app-weekly-chart',
  templateUrl: './weekly-chart.component.html',
  styleUrls: ['./weekly-chart.component.css']
})
export class WeeklyChartComponent {
  userId = Number(sessionStorage.getItem('userId'));
  weeks: { start: string; end: string }[] = [];

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    this.setupWeeks(); // Initialize the weeks for display
    this.fetchAttendanceData(); // Fetch weekly attendance data
  }

  setupWeeks() {
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const start = new Date();
      start.setDate(today.getDate() - (i * 7) - 6);
      const end = new Date();
      end.setDate(today.getDate() - (i * 7));

      this.weeks.unshift({ 
        start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
  }

  fetchAttendanceData() {
    this.userService.getUserAttendance(this.userId).subscribe({
      next: (data) => {
        const weeklyHours = this.calculateWeeklyHours(data); // Process weekly attendance data
        this.renderChart(weeklyHours); // Render chart with computed data
      },
      error: (error) => {
        console.error('Error fetching attendance data', error);
      }
    });
  }

  calculateWeeklyHours(data: any[]): number[] {
    const weeklyHours: number[] = [0, 0, 0, 0];
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

    for (let i = 0; i < 4; i++) {
      const start = new Date();
      start.setDate(today.getDate() - (i * 7) - 6);
      const end = new Date();
      end.setDate(today.getDate() - (i * 7));
      
      Object.keys(groupedByDate).forEach(dateStr => {
        const recordDate = new Date(dateStr);
        if (recordDate >= start && recordDate <= end) {
          const timeIns = groupedByDate[dateStr].time_in;
          const timeOuts = groupedByDate[dateStr].time_out;
          const totalHours = this.calculateTotalHours(timeIns, timeOuts);
          weeklyHours[i] += totalHours;
        }
      });
    }

    return weeklyHours;
  }

  calculateTotalHours(timeIns: string[], timeOuts: string[]): number {
    if (timeIns.length === 0 || timeOuts.length === 0) return 0;
    // Sum all time-in timestamps to compute total working hours
    const totalTimeIn = timeIns.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    const totalTimeOut = timeOuts.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    return (totalTimeOut - totalTimeIn) / (1000 * 60 * 60); // Convert milliseconds to hours
  }

  renderChart(hoursWorked: number[]) {
    const ctx = document.getElementById('weeklyHoursChart') as HTMLCanvasElement;
    
    const colors = {
      low: '#E03C32',  // Red (< 36 hrs) - Below Standard
      mid: '#FFD301',  // Yellow (36-40 hrs) - Meeting Target
      high: '#639754'  // Green (> 40 hrs) - Exceeding Target
    };

    // Assign colors based on the total hours worked
    const backgroundColors = hoursWorked.map(hours => {
      if (hours < 36) return colors.low;
      if (hours < 40) return colors.mid;
      return colors.high;
    });

    new Chart(ctx, {
      type: 'bar' as ChartType,
      data: {
        labels: this.weeks.map(week => `${week.start} - ${week.end}`), // Assign weeks to the X-axis
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
              stepSize: 10
            }
          },
          x: {
            title: { display: true, text: 'Weeks' }
          }
        }
      }
    });
  }
}

