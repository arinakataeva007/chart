import { AfterViewInit, ChangeDetectorRef, Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartAxesComponent } from "./components/chart-axes/chart-axes.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ChartService } from "./injections/chartMapping.service";
import { applications } from "./data/applications.data";
import { Point } from "./models/chart.model";
@Component({
  selector: "app-root",
  imports: [CommonModule, ChartAxesComponent, ReactiveFormsModule],
  providers: [ChartService],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements AfterViewInit {
  protected rangeApplications: Record<string, Point[]> = {};
  protected maxValuesInRange = signal<number>(0);
  constructor(private chart: ChartService, private cdr: ChangeDetectorRef) {
    this.form = new FormGroup({
      endTime: new FormControl("21:00"),
      range: new FormControl(15),
    });
  }

  protected form: FormGroup;

  public ngAfterViewInit(): void {
    console.log(this.form.getRawValue());
  }

  protected changeControlValue() {
    this.rangeApplications = {};
    const endTime = this.mapTimeFromControls(this.endTimeControl.value);
    const startTime = new Date(endTime);
    startTime.setMinutes(startTime.getMinutes() - this.rangeControl.value);

    const getTimeString = (date: Date): string => {
      // Функция для получения времени в формате "HH:MM:SS"
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
    };

    const startTimeStr = getTimeString(startTime);
    const endTimeStr = getTimeString(endTime);

    this.rangeApplications = this.chart.mapApplicationForChart(
      applications.filter((app) => {
        const appTimeStr = getTimeString(new Date(app.time));
        return appTimeStr >= startTimeStr && appTimeStr <= endTimeStr;
      }),
    );
    this.getMaxValue();
    this.cdr.detectChanges();
  }

  protected getMaxValue() {
    const allPoints = Object.values(this.rangeApplications).flat();

  if (!allPoints.length) return;

  const maxV = Math.max(...allPoints.map(p => p.value));

  console.log(maxV, allPoints);
  this.maxValuesInRange.set(maxV);
  }

  private get endTimeControl(): FormControl {
    return this.form.get("endTime") as FormControl;
  }
  private get rangeControl(): FormControl {
    return this.form.get("range") as FormControl;
  }
  private mapTimeFromControls(timeString: string) {
    const [hour, minutes] = timeString.split(":").map(Number);
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minutes,
    );
  }
}
