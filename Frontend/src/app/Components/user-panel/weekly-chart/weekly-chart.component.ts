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
export class WeeklyChartComponent implements OnInit {
  userId = Number(sessionStorage.getItem('userId'));
  weeks: { start: string; end: string; startDate: Date; endDate: Date }[] = [];

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    this.setupWeeks();
    this.fetchAttendanceData();
  }

  setupWeeks() {
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const start = new Date();
      start.setDate(today.getDate() - (i * 7) - 6);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date();
      end.setDate(today.getDate() - (i * 7));
      end.setHours(23, 59, 59, 999);
      
      this.weeks.unshift({
        start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        startDate: start,
        endDate: end
      });
    }
  }

  fetchAttendanceData() {
    this.userService.getUserAttendance(this.userId).subscribe({
      next: (data) => {
        const weeklyHours = this.calculateWeeklyHours(data);
        this.renderChart(weeklyHours);
      },
      error: (error) => {
        console.error('Error fetching attendance data', error);
      }
    });
  }

  calculateWeeklyHours(data: any[]): number[] {
    const weeklyHours: number[] = [0, 0, 0, 0];
    const groupedByDate: { [key: string]: { time_in: string[], time_out: string[] } } = {};

    data.forEach(record => {
      if (!groupedByDate[record.date]) {
        groupedByDate[record.date] = { time_in: [], time_out: [] };
      }
      groupedByDate[record.date].time_in.push(record.time_in);
      groupedByDate[record.date].time_out.push(record.time_out);
    });

    Object.keys(groupedByDate).forEach(dateStr => {
      const recordDate = new Date(dateStr);
      recordDate.setHours(0, 0, 0, 0); // Normalize time
      
      this.weeks.forEach((week, index) => {
        if (recordDate >= week.startDate && recordDate <= week.endDate) {
          const totalHours = this.calculateTotalHours(groupedByDate[dateStr].time_in, groupedByDate[dateStr].time_out);
          weeklyHours[index] += totalHours;
        }
      });
    });

    return weeklyHours;
  }

  calculateTotalHours(timeIns: string[], timeOuts: string[]): number {
    if (timeIns.length === 0 || timeOuts.length === 0) return 0;
    const totalTimeIn = timeIns.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    const totalTimeOut = timeOuts.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    return (totalTimeOut - totalTimeIn) / (1000 * 60 * 60);
  }

  renderChart(hoursWorked: number[]) {
    const ctx = document.getElementById('weeklyHoursChart') as HTMLCanvasElement;
    const colors = {
      low: '#E03C32',
      mid: '#FFD301',
      high: '#639754'
    };

    const backgroundColors = hoursWorked.map(hours => {
      if (hours < 36) return colors.low;
      if (hours < 40) return colors.mid;
      return colors.high;
    });

    new Chart(ctx, {
      type: 'bar' as ChartType,
      data: {
        labels: this.weeks.map(week => `${week.start} - ${week.end}`),
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
            ticks: { stepSize: 10 }
          },
          x: { title: { display: true, text: 'Weeks' } }
        }
      }
    });
  }
}

