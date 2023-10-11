import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisengagementComponent } from './disengagement.component';

describe('DisengagementComponent', () => {
  let component: DisengagementComponent;
  let fixture: ComponentFixture<DisengagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisengagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisengagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
