import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDetailMapComponent } from './guest-detail-map.component';

describe('GuestDetailMapComponent', () => {
  let component: GuestDetailMapComponent;
  let fixture: ComponentFixture<GuestDetailMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestDetailMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestDetailMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
