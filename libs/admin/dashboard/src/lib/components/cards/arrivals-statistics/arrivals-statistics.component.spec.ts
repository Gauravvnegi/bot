import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalsStatisticsComponent } from './arrivals-statistics.component';

describe('ArrivalsStatisticsComponent', () => {
  let component: ArrivalsStatisticsComponent;
  let fixture: ComponentFixture<ArrivalsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrivalsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrivalsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
