import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempCovid000001Component } from './temp-covid000001.component';

describe('TempCovid000001Component', () => {
  let component: TempCovid000001Component;
  let fixture: ComponentFixture<TempCovid000001Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempCovid000001Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempCovid000001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
