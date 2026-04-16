import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'max' })
export class MaxPipe implements PipeTransform {
  transform(points: any[], key: 'x' | 'y'): number {
    return Math.max(...points.map(p => p[key]), 1);
  }
}