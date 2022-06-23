import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackListFilterComponent } from './feedback-list-filter.component';

describe('FeedbackListFilterComponent', () => {
  let component: FeedbackListFilterComponent;
  let fixture: ComponentFixture<FeedbackListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
