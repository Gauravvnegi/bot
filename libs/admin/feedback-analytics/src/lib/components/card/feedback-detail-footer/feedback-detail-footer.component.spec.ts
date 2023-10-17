import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDetailFooterComponent } from './feedback-detail-footer.component';

describe('FeedbackDetailFooterComponent', () => {
  let component: FeedbackDetailFooterComponent;
  let fixture: ComponentFixture<FeedbackDetailFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackDetailFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackDetailFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
