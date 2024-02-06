import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarPricePreviewComponent } from './bar-price-preview.component';

describe('BarPricePreviewComponent', () => {
  let component: BarPricePreviewComponent;
  let fixture: ComponentFixture<BarPricePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarPricePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarPricePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
