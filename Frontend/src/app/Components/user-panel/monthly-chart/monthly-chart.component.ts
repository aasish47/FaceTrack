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
export class MonthlyChartComponent implements OnInit {
  userId = Number(sessionStorage.getItem('userId'));
  months: { name: string }[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    this.setupMonths();
    this.fetchAttendanceData();
  }

  setupMonths() {
    const today = new Date();
    for (let i = 3; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      this.months.push({ 
        name: date.toLocaleString('en-US', { month: 'short', year: 'numeric' }) 
      });
    }
  }


  calculateMonthlyHours(data: any[]): number[] {
    const monthlyHours: number[] = [0, 0, 0, 0];
    const today = new Date();
    const groupedByDate: { [key: string]: { time_in: string[], time_out: string[] } } = {};

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
      
      // Round to 2 decimal places for cleaner display
      monthlyHours[3 - i] = parseFloat(monthlyHours[3 - i].toFixed(2));
    }

    return monthlyHours;
  }

  calculateTotalHours(timeIns: string[], timeOuts: string[]): number {
    if (timeIns.length === 0 || timeOuts.length === 0) return 0;
    const totalTimeIn = timeIns.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    const totalTimeOut = timeOuts.reduce((sum, t) => sum + new Date(`1970-01-01T${t}Z`).getTime(), 0);
    return (totalTimeOut - totalTimeIn) / (1000 * 60 * 60);
  }

  renderChart(hoursWorked: number[]) {
    const ctx = document.getElementById('monthlyHoursChart') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    const colors = {
      low: '#E03C32',
      mid: '#FFD301',
      high: '#639754',
      grid: 'rgba(0, 0, 0, 0.05)',
      text: '#495057'
    };

    const backgroundColors = hoursWorked.map(hours => {
      if (hours < 144) return colors.low;
      if (hours < 160) return colors.mid;
      return colors.high;
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.months.map(month => month.name),
        datasets: [{
          label: 'Hours Worked',
          data: hoursWorked,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => this.adjustColor(color, -20)),
          borderWidth: 1,
          borderRadius: 6,
          barPercentage: 0.7,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.raw} hours`;
              }
            },
            displayColors: false,
            backgroundColor: '#343a40',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: colors.grid,
            },
            border: {
              display: false
            },
            ticks: {
              color: colors.text,
              stepSize: 40,
              callback: (value) => `${value} hrs`
            },
            title: {
              display: true,
              text: 'Total Hours',
              color: colors.text,
              font: {
                weight: 'bold'
              }
            }
          },
          x: {
            grid: {
              display: false,
              drawTicks: false
            },
            border: {
              display: false
            },
            ticks: {
              color: colors.text
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  renderEmptyChart() {
    const ctx = document.getElementById('monthlyHoursChart') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.months.map(month => month.name),
        datasets: [{
          label: 'No Data Available',
          data: [0, 0, 0, 0],
          backgroundColor: 'rgba(200, 200, 200, 0.2)',
          borderColor: 'rgba(200, 200, 200, 0.5)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          y: { display: false },
          x: { display: false }
        }
      }
    });
  }

  private adjustColor(color: string, amount: number): string {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }
  // Add these to your component class
hoursWorked: number[] = [0, 0, 0, 0];

getPercentage(hours: number): number {
  // Assuming 180 hours as 100% for visualization
  const maxHours = 180;
  return Math.min((hours / maxHours) * 100, 100);
}

getPerformanceClass(hours: number): string {
  if (hours >= 160) return 'performance-excellent';
  if (hours >= 144) return 'performance-good';
  return 'performance-needs-improvement';
}

getPerformanceText(hours: number): string {
  if (hours >= 160) return 'Excellent';
  if (hours >= 144) return 'Good';
  return 'Needs Improvement';
}

// Update your fetchAttendanceData to set hoursWorked
fetchAttendanceData() {
  this.isLoading = true;
  this.errorMessage = null;
  
  this.userService.getUserAttendance(this.userId).subscribe({
    next: (data) => {
      this.hoursWorked = this.calculateMonthlyHours(data);
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error fetching attendance data', error);
      this.errorMessage = 'Failed to load attendance data. Please try again later.';
      this.isLoading = false;
      this.hoursWorked = [0, 0, 0, 0];
    }
  });
}
}