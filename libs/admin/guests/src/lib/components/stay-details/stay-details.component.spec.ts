import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StayFeedbackDetailsComponent } from './stay-details.component';

describe('StayFeedbackDetailsComponent', () => {
  let component: StayFeedbackDetailsComponent;
  let fixture: ComponentFixture<StayFeedbackDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StayFeedbackDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StayFeedbackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
