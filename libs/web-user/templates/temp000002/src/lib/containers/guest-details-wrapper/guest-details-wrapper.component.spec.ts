import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDetailsWrapperComponent } from './guest-details-wrapper.component';

describe('GuestDetailsWrapperComponent', () => {
  let component: GuestDetailsWrapperComponent;
  let fixture: ComponentFixture<GuestDetailsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestDetailsWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestDetailsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
