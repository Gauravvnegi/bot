import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickReservationFormComponent } from './quick-reservation-form.component';

describe('QuickReservationFormComponent', () => {
  let component: QuickReservationFormComponent;
  let fixture: ComponentFixture<QuickReservationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickReservationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickReservationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
