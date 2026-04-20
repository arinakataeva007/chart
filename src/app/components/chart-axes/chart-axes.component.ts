import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
export type Tick = {
  x: number;
  time: Date;
  isMajor: boolean;
};
export interface Point {
  time: Date;
  value: number;
}
export interface PointCoordinate {
  x: number;
  y: number;
}
@Component({
  selector: "app-chart-axes",
  imports: [CommonModule],
  templateUrl: "./chart-axes.component.html",
  styleUrl: "./chart-axes.component.scss",
})
export class ChartAxesComponent implements OnInit {
  @Input() height = 368;
  @Input() width = 1708;
  @Input() maxValueY = 50;
  @Input() valuesX: string[] = [];
  @Input() axisXValues: string[] = [];
  @Input() rangeMinutes = 15;
  @Input() points: Point[][] = [
    [
      { time: new Date(2026, 0, 1, 21, 2, 8), value: 10 },
      { time: new Date(2026, 0, 1, 21, 5, 0), value: 40 },
      { time: new Date(2026, 0, 1, 21, 10, 0), value: 20 },
    ],
    [
      { time: new Date(2026, 0, 1, 21, 5, 42), value: 50 },
      { time: new Date(2026, 0, 1, 21, 7, 0), value: 11 },
      { time: new Date(2026, 0, 1, 21, 10, 0), value: 30 },
    ],
  ];

  constructor() {}

  public ngOnInit() {
    this.initScales();
    this.generateAxisX();
    this.generateAxisY();
  }

  public get templateHeight() {
    return this.height + this.paddingChart;
  }

  // Фиксированное количество ключевых делений
  private countDivivsionsX = 6;
  private countDivivsionsY = 10;

  // Количество делений в отрезке на осях
  private countDivivsionsSegment = 5;

  // Для того, чтобы было видно последнее деление на осях
  protected paddingChart = 7;

  protected ticksY: number[] = [];
  protected markTicksY: number[] = [];
  protected ticks: Tick[] = [];

  colors = ["blue", "red", "green", "orange"];

  buildPath(points: PointCoordinate[]): string {
    if (!points || points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      for (let t = 0; t <= 1; t += 0.1) {
        const t2 = t * t;
        const t3 = t2 * t;

        const x =
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

        const y =
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

        if (!isNaN(x) && !isNaN(y)) {
          path += ` L ${x} ${y}`;
        }
      }
    }

    return path;
  }

  private generateAxisX() {
    if (!this.width) return;

    this.ticks = [];

    const totalMs = this.endTime - this.startTime;

    const totalSteps =
      (this.countDivivsionsX + 1) * this.countDivivsionsSegment;

    const stepWidth = this.width / totalSteps;
    const stepTime = totalMs / totalSteps;

    for (let i = 1; i <= totalSteps; i++) {
      this.ticks.push({
        x: i * stepWidth,
        time: new Date(this.startTime + i * stepTime),
        isMajor: i % this.countDivivsionsSegment === 0,
      });
    }
  }

  private generateAxisY() {
    if (!this.height) return;
    const stepheight =
      this.height / (this.countDivivsionsY * this.countDivivsionsSegment);
    for (let i = 0; i <= this.height; i += stepheight) {
      this.ticksY.push(i);
    }
    for (let i = 1; i <= this.countDivivsionsY; i++) {
      this.markTicksY.push(i * (this.countDivivsionsSegment * stepheight));
    }
  }

  private startTime!: number;
  private endTime!: number;

  private initScales() {
    const allPoints = this.points.flat();

    const times = allPoints.map((p) => p.time.getTime());

    this.startTime = Math.min(...times);
    this.endTime = Math.max(...times);
  }

  private mapX(time: Date): number {
  const t = time.getTime();

  return ((t - this.startTime) / (this.endTime - this.startTime)) * this.width;
}
  private mapY(value: number): number {
    return this.templateHeight - (value / this.maxValueY) * this.height;
  }
  public get scaledSeries(): PointCoordinate[][] {
    return this.points.map((series) => {
      const sorted = [...series].sort(
        (a, b) => a.time.getTime() - b.time.getTime(),
      );

      return sorted.map((p) => ({
        x: this.mapX(p.time),
        y: this.mapY(p.value),
      }));
    });
  }
}
