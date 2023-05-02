import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSourceDataTableComponent } from './booking-source-data-table.component';

describe('BookingSourceDataTableComponent', () => {
  let component: BookingSourceDataTableComponent;
  let fixture: ComponentFixture<BookingSourceDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookingSourceDataTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingSourceDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
