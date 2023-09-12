import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestStatisticsComponent } from './guest-statistics.component';

describe('GuestStatisticsComponent', () => {
  let component: GuestStatisticsComponent;
  let fixture: ComponentFixture<GuestStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuestStatisticsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
