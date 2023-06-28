import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationFormWrapperComponent } from './reservation-form-wrapper.component';

describe('ReservationFormWrapperComponent', () => {
  let component: ReservationFormWrapperComponent;
  let fixture: ComponentFixture<ReservationFormWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationFormWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationFormWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
