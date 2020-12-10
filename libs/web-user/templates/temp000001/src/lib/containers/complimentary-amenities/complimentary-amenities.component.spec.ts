import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplimentaryAmenitiesComponent } from './complimentary-amenities.component';

describe('ComplimentaryServiceComponent', () => {
  let component: ComplimentaryAmenitiesComponent;
  let fixture: ComponentFixture<ComplimentaryAmenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplimentaryAmenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplimentaryAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
