import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDataTableModelComponent } from './reservation-datatable-model.component';

describe('ReservationDatatableModelComponent', () => {
  let component: ReservationDataTableModelComponent;
  let fixture: ComponentFixture<ReservationDataTableModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationDataTableModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationDataTableModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
