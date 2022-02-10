import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDatatableModalComponent } from './reservation-datatable-modal.component';

describe('ReservationDatatableModalComponent', () => {
  let component: ReservationDatatableModalComponent;
  let fixture: ComponentFixture<ReservationDatatableModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationDatatableModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationDatatableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
