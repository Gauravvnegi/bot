import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackNotesComponent } from './feedback-notes.component';

describe('FeedbackNotesComponent', () => {
  let component: FeedbackNotesComponent;
  let fixture: ComponentFixture<FeedbackNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
