import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Point, PointCoordinate, Tick } from "../../models/chart.model";

@Component({
  selector: "app-chart-axes",
  imports: [CommonModule],
  templateUrl: "./chart-axes.component.html",
  styleUrl: "./chart-axes.component.scss",
})
export class ChartAxesComponent implements OnChanges {
  @Input() height = 368; // высота оси Y
  @Input() width = 1708; // ширина оиси Х
  @Input() maxValueY = 50; // самое большое значение по оси Y
  @Input() maxValueX!: Date;
  @Input() rangeMinutes = 15; // задает диапозон от конечного времени (необходимо выбирать последний элемент с временем макс. приближенным к последнему и потом уже брать все точки, входящие в диапозон)
  @Input() points: Record<string, Point[]> = {};

  constructor(private cdr: ChangeDetectorRef) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes["points"] || changes["maxValueY"]) {
      console.log(this.points, this.maxValueY);
      this.rebuildChart();
    }
  }

  public get templateHeight() {
    return this.height + this.paddingChart;
  }

  // Для того, чтобы было видно последнее деление на осях
  protected paddingChart = 7;

  protected ticksY: number[] = [];
  protected markTicksY: number[] = [];
  protected ticks: Tick[] = [];

  colors = ["blue", "red", "green", "orange"];

  private startTime!: number;
  private endTime!: number;


  // Фиксированное количество ключевых делений
  private countDivivsionsX = 6;
  private countDivivsionsY = 10;

  // Количество делений в отрезке на осях
  private countDivivsionsSegment = 5;

  protected buildPath(points: PointCoordinate[]): string {
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

  /**
   * Мапим точки из типа время:значение к координатам на графике
   */
  protected get scaledSeries(): PointCoordinate[][] {
    return Object.entries(this.points).map(([id, series]) => {
      const sorted = [...series].sort(
        (a, b) => a.time.getTime() - b.time.getTime(),
      );

      return sorted.map((p) => ({
        id: id,
        x: this.mapX(p.time),
        y: this.mapY(p.value),
      }));
    });
  }

  protected clickOnPoint(p: any){
    console.log(p);
  }

  private generateAxisX() {
    if (!this.width || isNaN(this.startTime) || isNaN(this.endTime)) return;
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

  /**
   * Задает разметку по оси Х учитывая максимальное время элемента из массива и диапозон
   */
  private initScales() {
    const allPoints = Object.values(this.points).flat();
    const validTimes = allPoints
      .map((p) => p.time.getTime())
      .filter((t) => !isNaN(t));

    if (!validTimes.length) {
      return;
    }

    const maxTime = Math.max(...validTimes);

    this.endTime = maxTime;
    this.startTime = maxTime - this.rangeMinutes * 60 * 1000;
  }

  private mapX(time: Date): number {
    const t = time.getTime();

    if (isNaN(t) || isNaN(this.startTime) || isNaN(this.endTime)) {
      return 0;
    }

    const range = this.endTime - this.startTime;
    if (!range) return 0;

    return ((t - this.startTime) / range) * this.width;
  }

  private mapY(value: number): number {
    return this.templateHeight - (value / this.maxValueY) * this.height;
  }

  /**
   * Фильтруем точки, чтобы точно отсеить все не входящие в диапозон
   */
  private filterPointsByRange() {
    const filtered: Record<string, Point[]> = {};
    for (const key in this.points) {
      filtered[key] = this.points[key].filter((p) => {
        const t = p.time.getTime();
        return t >= this.startTime && t <= this.endTime;
      });
    }
    this.points = filtered;
  }

  private rebuildChart() {
    if(!this.points) return;
    this.ticks = [];
    this.ticksY = [];
    this.markTicksY = [];

    this.initScales();
    this.filterPointsByRange();
    this.generateAxisX();
    this.generateAxisY();
    this.cdr.detectChanges();
  }
}
