import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000001Component } from './temp000001.component';

describe('Temp000001Component', () => {
  let component: Temp000001Component;
  let fixture: ComponentFixture<Temp000001Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000001Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
