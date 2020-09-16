import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecialAmenitiesComponent } from './edit-special-amenities.component';

describe('SpecialAmenitiesComponent', () => {
  let component: EditSpecialAmenitiesComponent;
  let fixture: ComponentFixture<EditSpecialAmenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSpecialAmenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSpecialAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
