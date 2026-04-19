import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MaxPipe } from "./max.pipe";
import { ChartAxesComponent } from "./components/chart-axes/chart-axes.component";
export interface Point {
  x: number;
  y: number;
}
@Component({
  selector: "app-root",
  imports: [CommonModule, ChartAxesComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {

  protected heightChart = 368;
  protected widthChart = 1708;
  protected points: Point[] = [
    { x: 10, y: 20 },
    { x: 30, y: 40 },
    { x: 50, y: 10 },
    { x: 70, y: 60 },
    { x: 90, y: 30 },
  ];
  //
  protected ticksY: number[] = [];
  protected ticksX: number[] = [];
  protected markTicksY: number[] = [];
  protected markTicksX: number[] = [];

  ngOnInit() {
    // каждые 5px
    for (let i = 0; i <= this.heightChart; i += 7.36) {
      this.ticksY.push(i);
    }

    for (let i = 1; i <= 10; i++) {
      this.markTicksY.push(i * 36.8);
    }

    for(let i = 0; i<= this.widthChart; i += 48.8){
      this.ticksX.push(i);
    }

    for (let i = 1; i <= 6; i++) {
      this.markTicksX.push(i * 244);
    }
  }
  //

  public get smoothPathCatmull(): string {
    if (this.points.length < 2) return "";

    let path = `M ${this.points[0].x} ${this.points[0].y}`;

    for (let i = 0; i < this.points.length - 1; i++) {
      const p0 = this.points[Math.max(0, i - 1)];
      const p1 = this.points[i];
      const p2 = this.points[i + 1];
      const p3 = this.points[Math.min(this.points.length - 1, i + 2)];

      // Коэффициенты Catmull-Rom
      const tension = 0.5; // 0.5 = стандартный Catmull-Rom

      for (let t = 0; t <= 1; t += 0.1) {
        // Разбиваем на сегменты
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
}
