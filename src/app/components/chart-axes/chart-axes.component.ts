import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
export type Tick = {
  x: number;
  time: Date;
  isMajor: boolean;
};

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

  constructor() {}

  public ngOnInit() {
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
  // protected ticksX: number[] = [];
  protected markTicksY: number[] = [];
  protected ticks: Tick[] = [];
  // protected markTicksX: number[] = [];

  // private generateAxisX() {
  //   if (!this.width) return;
  //   // + 1 потому что по оси X 7 отрезков, но последний не подписываем
  //   const stepWidth =
  //     this.width / ((this.countDivivsionsX + 1) * this.countDivivsionsSegment);
  //   let index = 1;

  //   for (let x = stepWidth; x <= this.width; x += stepWidth) {
  //     this.ticksX.push(x);
  //     // каждый countDivivsionsSegment-й шаг добавляем в markTicksX
  //     if (index !== 0 && index % this.countDivivsionsSegment === 0) {
  //       const markIndex = index / this.countDivivsionsSegment;

  //       if (markIndex <= this.countDivivsionsX) {
  //         this.markTicksX.push(x);
  //       }
  //     }

  //     index++;
  //   }
  // }

  private generateAxisX() {
    if (!this.width) return;

    this.ticks = [];

    const start = new Date();
    start.setHours(21, 0, 0, 0);

    const end = new Date();
    end.setHours(21, 15, 0, 0);

    const totalMs = end.getTime() - start.getTime();

    const totalSteps =
      (this.countDivivsionsX + 1) * this.countDivivsionsSegment;

    const stepWidth = this.width / totalSteps;
    const stepTime = totalMs / totalSteps;

    for (let i = 1; i <= totalSteps; i++) {
      const x = i * stepWidth;
      const time = new Date(start.getTime() + i * stepTime);

      this.ticks.push({
        x,
        time,
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
}
