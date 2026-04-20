import { AfterViewInit, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartAxesComponent } from "./components/chart-axes/chart-axes.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ChartService } from "./injections/chartMapping.service";
import { applications, IApplication } from "./data/applications.data";
import { Point } from "./models/chart.model";
import { range } from "rxjs";
@Component({
  selector: "app-root",
  imports: [CommonModule, ChartAxesComponent, ReactiveFormsModule],
  providers: [ChartService],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements AfterViewInit {
  protected rangeApplications: IApplication[] | undefined = undefined;
  protected dataForChart: Record<string, Point[]>;
  constructor(private chart: ChartService) {
    this.dataForChart = this.chart.mapApplicationForChart(applications);
    this.form = new FormGroup({
      startTime: new FormControl("21:00"),
      endTime: new FormControl(""),
      range: new FormControl(0),
    });
  }

  protected form: FormGroup;

  public ngAfterViewInit(): void {
    console.log(this.form.getRawValue());
  }

  protected changeControlValue() {
    this.rangeApplications = [];
    const endTime = this.mapTimeFromControls(this.endTimeControl.value);
    const startTime = new Date(endTime);
    startTime.setMinutes(startTime.getMinutes() - this.rangeControl.value);
    console.log(startTime, endTime); // Функция для получения времени в формате "HH:MM:SS"
    const getTimeString = (date: Date): string => {
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
    };

    const startTimeStr = getTimeString(startTime);
    const endTimeStr = getTimeString(endTime);

    this.rangeApplications = applications.filter((app) => {
      const appTimeStr = getTimeString(new Date(app.time));
      return appTimeStr >= startTimeStr && appTimeStr <= endTimeStr;
    });

    console.log("Range:", startTimeStr, "-", endTimeStr, this.rangeApplications);
  }

  private get startTimeControl(): FormControl {
    return this.form.get("startTime") as FormControl;
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
