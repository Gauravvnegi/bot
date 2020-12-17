import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestStatusStatisticsComponent } from './guest-status-statistics.component';

describe('GuestStatusStatisticsComponent', () => {
  let component: GuestStatusStatisticsComponent;
  let fixture: ComponentFixture<GuestStatusStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestStatusStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestStatusStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
