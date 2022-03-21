import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDatatableModalComponent } from './feedback-datatable.component';

describe('FeedbackDatatableModalComponent', () => {
  let component: FeedbackDatatableModalComponent;
  let fixture: ComponentFixture<FeedbackDatatableModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackDatatableModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackDatatableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
