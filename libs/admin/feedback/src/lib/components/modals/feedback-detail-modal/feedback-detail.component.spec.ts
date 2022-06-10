import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDetailModalComponent } from './feedback-detail.component';

describe('FeedbackDetailModalComponent', () => {
  let component: FeedbackDetailModalComponent;
  let fixture: ComponentFixture<FeedbackDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackDetailModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
