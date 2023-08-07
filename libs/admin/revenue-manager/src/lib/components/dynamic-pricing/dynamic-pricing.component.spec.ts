import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPricingComponent } from './dynamic-pricing.component';

describe('DynamicPricingComponent', () => {
  let component: DynamicPricingComponent;
  let fixture: ComponentFixture<DynamicPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
