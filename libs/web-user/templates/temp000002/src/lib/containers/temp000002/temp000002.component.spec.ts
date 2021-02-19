import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000002Component } from './temp000002.component';

describe('Temp000002Component', () => {
  let component: Temp000002Component;
  let fixture: ComponentFixture<Temp000002Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000002Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
