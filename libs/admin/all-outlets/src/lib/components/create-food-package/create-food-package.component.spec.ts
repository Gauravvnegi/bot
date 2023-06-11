import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFoodPackageComponent } from './create-food-package.component';

describe('CreateFoodPackageComponent', () => {
  let component: CreateFoodPackageComponent;
  let fixture: ComponentFixture<CreateFoodPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFoodPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFoodPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
