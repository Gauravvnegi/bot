import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelUsageDatatableComponent } from './hotel-usage-datatable.component';

describe('HotelUsageDatatableComponent', () => {
  let component: HotelUsageDatatableComponent;
  let fixture: ComponentFixture<HotelUsageDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelUsageDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelUsageDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
