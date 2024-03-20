import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintBreakdownComponent } from './complaint-breakdown.component';

describe('ComplaintBreakdownComponent', () => {
  let component: ComplaintBreakdownComponent;
  let fixture: ComponentFixture<ComplaintBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
