import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartureStatisticsComponent } from './departure-stats.component';

describe('DepartureStatisticsComponent', () => {
  let component: DepartureStatisticsComponent;
  let fixture: ComponentFixture<DepartureStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DepartureStatisticsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartureStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
