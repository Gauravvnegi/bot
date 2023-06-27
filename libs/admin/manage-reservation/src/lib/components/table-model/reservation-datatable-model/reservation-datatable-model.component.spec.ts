import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDatatableModelComponent } from './reservation-datatable-model.component';

describe('ReservationDatatableModelComponent', () => {
  let component: ReservationDatatableModelComponent;
  let fixture: ComponentFixture<ReservationDatatableModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationDatatableModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationDatatableModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
