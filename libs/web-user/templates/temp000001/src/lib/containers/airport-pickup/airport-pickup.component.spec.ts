import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportPickupComponent } from './airport-pickup.component';

describe('AirportPickupComponent', () => {
  let component: AirportPickupComponent;
  let fixture: ComponentFixture<AirportPickupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportPickupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
