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
  @Input() points: Point[] = [
    { time: new Date(2024, 0, 1, 21, 2, 8), value: 10 },
    { time: new Date(2024, 0, 1, 21, 5, 0), value: 40 },
    { time: new Date(2024, 0, 1, 21, 10, 0), value: 20 },
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

  // public get smoothPathCatmull(): string {
  //   if (this.points.length < 2) return "";

  //   let path = `M ${this.points[0].x} ${this.points[0].y}`;

  //   for (let i = 0; i < this.points.length - 1; i++) {
  //     const p0 = this.points[Math.max(0, i - 1)];
  //     const p1 = this.points[i];
  //     const p2 = this.points[i + 1];
  //     const p3 = this.points[Math.min(this.points.length - 1, i + 2)];

  //     // Коэффициенты Catmull-Rom
  //     const tension = 0.5; // 0.5 = стандартный Catmull-Rom

  //     for (let t = 0; t <= 1; t += 0.1) {
  //       // Разбиваем на сегменты
  //       const t2 = t * t;
  //       const t3 = t2 * t;

  //       const x =
  //         0.5 *
  //         (2 * p1.x +
  //           (-p0.x + p2.x) * t +
  //           (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
  //           (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

  //       const y =
  //         0.5 *
  //         (2 * p1.y +
  //           (-p0.y + p2.y) * t +
  //           (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
  //           (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

  //       path += ` L ${x} ${y}`;
  //     }
  //   }

  //   return path;
  // }
  public get smoothPathCatmull(): string {
    const pts = this.scaledPoints;

    if (pts.length < 2) return "";

    let path = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

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

        path += ` L ${x} ${y}`;
      }
    }

    return path;
  }

  private generateAxisX() {
    if (!this.width) return;
    const start = new Date();
    start.setHours(21, 0, 0, 0);

    const end = new Date();
    end.setHours(21, 15, 0, 0);

    const totalMs = end.getTime() - start.getTime();
    //+1 потому что 7 отрезков, но последний не подписываем
    const totalSteps =
      (this.countDivivsionsX + 1) * this.countDivivsionsSegment;

    const stepWidth = this.width / totalSteps;
    const stepTime = totalMs / totalSteps;

    for (let i = 1; i <= totalSteps; i++) {
      this.ticks.push({
        x: i * stepWidth,
        time: new Date(start.getTime() + i * stepTime),
        isMajor: i % this.countDivivsionsSegment === 0, // каждое 5 деление
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
    // const start = new Date();
    // start.setHours(21, 0, 0, 0);

    // const end = new Date();
    // end.setHours(21, 15, 0, 0);

    // this.startTime = start.getTime();
    // this.endTime = end.getTime();

    const times = this.points.map((p) => p.time.getTime());

    this.startTime = Math.min(...times);
    this.endTime = Math.max(...times);
  }

  private mapX(time: Date): number {
    const t = time.getTime();

    if (t < this.startTime || t > this.endTime) {
      return NaN; // или не рисовать точку
    }

    return (
      ((t - this.startTime) / (this.endTime - this.startTime)) * this.width
    );
  }
  private mapY(value: number): number {
    return this.templateHeight - (value / this.maxValueY) * this.height;
  }
  public get scaledPoints(): any[] {
    const result = this.points.map((p) => ({
      x: this.mapX((p as any).time),
      y: this.mapY((p as any).value),
    }));

    console.log(result);
    return result;
  }
}
