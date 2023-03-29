import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReservationDataTableComponent } from './manage-reservation-data-table.component';

describe('ManageReservationDataTableComponent', () => {
  let component: ManageReservationDataTableComponent;
  let fixture: ComponentFixture<ManageReservationDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageReservationDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReservationDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
