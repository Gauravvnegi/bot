import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidAmenitiesComponent } from './paid-amenities.component';

describe('PaidAmenitiesComponent', () => {
  let component: PaidAmenitiesComponent;
  let fixture: ComponentFixture<PaidAmenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidAmenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
