import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
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
  protected ticksX: number[] = [];
  protected markTicksY: number[] = [];
  protected markTicksX: number[] = [];

  private generateAxisX() {
    if (!this.width) return;
    // + 1 потому что по оси X 7 отрезков, но последний не подписываем
    const stepWidth =
      this.width / ((this.countDivivsionsX + 1) * this.countDivivsionsSegment);
    for (let i = 0; i <= this.width; i += stepWidth) {
      this.ticksX.push(i);
    }
    for(let i = 1; i<= this.countDivivsionsX; i++){
      this.markTicksX.push(i*(this.countDivivsionsSegment * stepWidth));
    }
  }

  private generateAxisY() {
    if (!this.height) return;
    // + 1 потому что по оси X 7 отрезков, но последний не подписываем
    const stepheight =
      this.height / (this.countDivivsionsY * this.countDivivsionsSegment);
    for (let i = 0; i <= this.height; i += stepheight) {
      this.ticksY.push(i);
    }
    for(let i = 1; i<= this.countDivivsionsY; i++){
      this.markTicksY.push(i*(this.countDivivsionsSegment * stepheight));
    }
  }
}
