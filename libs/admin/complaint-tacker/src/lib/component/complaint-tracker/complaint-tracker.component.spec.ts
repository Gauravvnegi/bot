import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintTrackerComponent } from './complaint-tracker.component';

describe('ComplaintTrackerComponent', () => {
  let component: ComplaintTrackerComponent;
  let fixture: ComponentFixture<ComplaintTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
