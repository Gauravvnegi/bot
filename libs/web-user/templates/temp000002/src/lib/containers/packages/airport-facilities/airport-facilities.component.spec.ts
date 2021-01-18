import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportFacilitiesComponent } from './airport-facilities.component';

describe('AirportFacilitiesComponent', () => {
  let component: AirportFacilitiesComponent;
  let fixture: ComponentFixture<AirportFacilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportFacilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
