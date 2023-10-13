import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackTypesComponent } from './feedback-types.component';

describe('FeedbackTypesComponent', () => {
  let component: FeedbackTypesComponent;
  let fixture: ComponentFixture<FeedbackTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
