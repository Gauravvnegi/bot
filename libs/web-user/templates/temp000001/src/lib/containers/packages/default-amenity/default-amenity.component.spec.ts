import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultAmenityComponent } from './default-amenity.component';

describe('DefaultAmenityComponent', () => {
  let component: DefaultAmenityComponent;
  let fixture: ComponentFixture<DefaultAmenityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultAmenityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultAmenityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
