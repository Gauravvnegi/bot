import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempLoader000001Component } from './temp-loader000001.component';

describe('TempLoader000001Component', () => {
  let component: TempLoader000001Component;
  let fixture: ComponentFixture<TempLoader000001Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempLoader000001Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempLoader000001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
