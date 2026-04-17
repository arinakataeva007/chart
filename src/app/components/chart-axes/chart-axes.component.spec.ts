import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAxesComponent } from './chart-axes.component';

describe('ChartAxesComponent', () => {
  let component: ChartAxesComponent;
  let fixture: ComponentFixture<ChartAxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartAxesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartAxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
