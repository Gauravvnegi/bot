import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDatatableComponent } from './feedback-datatable.component';

describe('FeedbackDatatableComponent', () => {
  let component: FeedbackDatatableComponent;
  let fixture: ComponentFixture<FeedbackDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackDatatableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
