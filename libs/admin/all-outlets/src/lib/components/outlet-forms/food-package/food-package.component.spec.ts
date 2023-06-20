import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodPackageComponent } from './food-package.component';

describe('FoodPackageComponent', () => {
  let component: FoodPackageComponent;
  let fixture: ComponentFixture<FoodPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
