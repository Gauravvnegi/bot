import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelInfoFormComponent } from './hotel-info-form.component';

describe('HotelInfoFormComponent', () => {
  let component: HotelInfoFormComponent;
  let fixture: ComponentFixture<HotelInfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelInfoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
