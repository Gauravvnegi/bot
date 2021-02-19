import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempLoader000002Component } from './temp-loader000002.component';

describe('TempLoader000002Component', () => {
  let component: TempLoader000002Component;
  let fixture: ComponentFixture<TempLoader000002Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempLoader000002Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempLoader000002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
