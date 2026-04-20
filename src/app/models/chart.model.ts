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