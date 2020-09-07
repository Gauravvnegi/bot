import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialAmenitiesComponent } from './special-amenities.component';

describe('SpecialAmenitiesComponent', () => {
  let component: SpecialAmenitiesComponent;
  let fixture: ComponentFixture<SpecialAmenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialAmenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
