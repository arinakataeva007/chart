import { Injectable } from "@angular/core";
import { IApplication } from "../data/applications.data";
import { Point } from "../models/chart.model";

@Injectable()
export class ChartService {
  public mapApplicationForChart(apps: IApplication[]): Record<string, Point[]> {
    const result: Record<string, Point[]> = {};
    for (let app of apps) {
      if (!result[app.id]) {
        result[app.id] = [];
      }

      result[app.id].push({
        time: new Date(app.time),
        value: app.value,
      });
    }
    return result;
  }
}
