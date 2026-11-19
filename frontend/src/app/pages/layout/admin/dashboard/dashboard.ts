import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from '@openng/optimus-ui/datepicker';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { StatDateItem, StatItem, StatsService } from '@app/services';

const INK = '#17171F';
const YELLOW = '#facc15';
const PIE_COLORS = [
  '#facc15',
  '#17171F',
  '#fde68a',
  '#52525b',
  '#fbbf24',
  '#a1a1aa',
  '#eab308',
  '#d4d4d8',
];

@Component({
  imports: [BaseChartDirective, DatePickerModule, FormsModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly statsService = inject(StatsService);

  private rangedSub?: Subscription;
  private generalSub?: Subscription;

  protected readonly barType = 'bar' as const;
  protected readonly lineType = 'line' as const;
  protected readonly doughnutType = 'doughnut' as const;
  protected readonly pieType = 'pie' as const;

  protected readonly dateRange = signal<Date[]>([
    new Date(Date.now() - 30 * 86_400_000),
    new Date(),
  ]);

  protected readonly isLoadingRanged = signal(true);
  protected readonly isLoadingGeneral = signal(true);
  protected readonly rangedError = signal(false);
  protected readonly generalError = signal(false);
  protected readonly rangeError = signal(false);

  protected readonly postsByUser = signal<StatItem[]>([]);
  protected readonly commentsByDay = signal<StatDateItem[]>([]);
  protected readonly commentsPerPost = signal<StatItem[]>([]);
  protected readonly loginsByUser = signal<StatItem[]>([]);
  protected readonly profileVisits = signal<StatItem[]>([]);
  protected readonly likesPerDay = signal<StatDateItem[]>([]);

  protected readonly postsChart = computed(() => this.buildBarData(this.postsByUser(), 'Publicaciones'));
  protected readonly commentsChart = computed(() =>
    this.buildLineData(this.commentsByDay(), 'Comentarios', YELLOW),
  );
  protected readonly commentsPerPostChart = computed(() =>
    this.buildBarData(this.commentsPerPost(), 'Comentarios'),
  );
  protected readonly loginsChart = computed(() => this.buildDoughnutData(this.loginsByUser()));
  protected readonly visitsChart = computed(() => this.buildPieData(this.profileVisits()));
  protected readonly likesChart = computed(() =>
    this.buildLineData(this.likesPerDay(), 'Me gusta', INK),
  );

  protected readonly barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: INK } },
      y: { beginAtZero: true, ticks: { color: INK, precision: 0 } },
    },
  };

  protected readonly horizontalBarOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { color: INK, precision: 0 } },
      y: { grid: { display: false }, ticks: { color: INK } },
    },
  };

  protected readonly lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    elements: { line: { tension: 0.35, borderWidth: 2 }, point: { radius: 3 } },
    scales: {
      x: { grid: { display: false }, ticks: { color: INK } },
      y: { beginAtZero: true, ticks: { color: INK, precision: 0 } },
    },
  };

  protected readonly doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: { legend: { position: 'bottom', labels: { color: INK, boxWidth: 12 } } },
  };

  protected readonly pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: INK, boxWidth: 12 } } },
  };

  ngOnInit() {
    this.loadRanged();
    this.loadGeneral();
  }

  protected onDateRangeChange(value: Date[] | null) {
    this.dateRange.set(value ?? []);
    this.loadRanged();
  }

  protected retryRanged() {
    this.loadRanged();
  }

  protected retryGeneral() {
    this.loadGeneral();
  }

  private loadRanged() {
    const range = this.dateRange();

    if (range.length !== 2 || !range[0] || !range[1]) {
      this.rangeError.set(true);
      return;
    }

    const from = this.toInputDate(range[0]);
    const to = this.toInputDate(range[1]);

    if (from > to) {
      this.rangeError.set(true);
      return;
    }

    this.rangeError.set(false);
    this.rangedError.set(false);
    this.isLoadingRanged.set(true);
    this.rangedSub?.unsubscribe();

    this.rangedSub = forkJoin({
      posts: this.statsService.postsByUser(from, to),
      comments: this.statsService.commentsByDay(from, to),
      perPost: this.statsService.commentsPerPost(from, to),
    })
      .pipe(finalize(() => this.isLoadingRanged.set(false)))
      .subscribe({
        next: ({ posts, comments, perPost }) => {
          this.postsByUser.set(posts);
          this.commentsByDay.set(comments);
          this.commentsPerPost.set(perPost);
        },
        error: () => this.rangedError.set(true),
      });
  }

  private loadGeneral() {
    this.generalError.set(false);
    this.isLoadingGeneral.set(true);
    this.generalSub?.unsubscribe();

    this.generalSub = forkJoin({
      logins: this.statsService.loginsByUser(),
      visits: this.statsService.profileVisitsByUser(),
      likes: this.statsService.likesPerDay(),
    })
      .pipe(finalize(() => this.isLoadingGeneral.set(false)))
      .subscribe({
        next: ({ logins, visits, likes }) => {
          this.loginsByUser.set(logins);
          this.profileVisits.set(visits);
          this.likesPerDay.set(likes);
        },
        error: () => this.generalError.set(true),
      });
  }

  private buildBarData(items: StatItem[], label: string): ChartData<'bar'> {
    return {
      labels: items.map((item) => item.label),
      datasets: [
        {
          label,
          data: items.map((item) => item.count),
          backgroundColor: YELLOW,
          borderColor: INK,
          borderWidth: 1.5,
          borderRadius: 6,
        },
      ],
    };
  }

  private buildLineData(items: StatDateItem[], label: string, color: string): ChartData<'line'> {
    return {
      labels: items.map((item) => item.date),
      datasets: [
        {
          label,
          data: items.map((item) => item.count),
          borderColor: color,
          backgroundColor: `${color}33`,
          pointBackgroundColor: color,
          pointBorderColor: INK,
          pointBorderWidth: 1,
          fill: true,
        },
      ],
    };
  }

  private buildDoughnutData(items: StatItem[]): ChartData<'doughnut'> {
    return {
      labels: items.map((item) => item.label),
      datasets: [
        {
          data: items.map((item) => item.count),
          backgroundColor: PIE_COLORS,
          borderColor: INK,
          borderWidth: 1.5,
        },
      ],
    };
  }

  private buildPieData(items: StatItem[]): ChartData<'pie'> {
    return {
      labels: items.map((item) => item.label),
      datasets: [
        {
          data: items.map((item) => item.count),
          backgroundColor: PIE_COLORS,
          borderColor: INK,
          borderWidth: 1.5,
        },
      ],
    };
  }

  private toInputDate(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
