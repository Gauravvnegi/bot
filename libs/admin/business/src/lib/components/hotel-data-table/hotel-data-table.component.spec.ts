import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelDataTableComponent } from './hotel-data-table.component';

describe('HotelDataTableComponent', () => {
  let component: HotelDataTableComponent;
  let fixture: ComponentFixture<HotelDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HotelDataTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
