import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDisengagementComponent } from './complaint-disengagement.component';

describe('ComplaintDisengagementComponent', () => {
  let component: ComplaintDisengagementComponent;
  let fixture: ComponentFixture<ComplaintDisengagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintDisengagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintDisengagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
