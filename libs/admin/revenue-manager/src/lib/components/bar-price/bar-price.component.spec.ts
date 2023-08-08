import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarPriceComponent } from './bar-price.component';

describe('BarPriceComponent', () => {
  let component: BarPriceComponent;
  let fixture: ComponentFixture<BarPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
