import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DualPlotComponent } from './dual-plot.component';

describe('DualPlotComponent', () => {
  let component: DualPlotComponent;
  let fixture: ComponentFixture<DualPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DualPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DualPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
