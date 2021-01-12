import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFeedbackComponent } from './booking-feedback.component';

describe('BookingFeedbackComponent', () => {
  let component: BookingFeedbackComponent;
  let fixture: ComponentFixture<BookingFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
