import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000002RadioComponent } from './temp000002-radio.component';

describe('Temp000002RadioComponent', () => {
  let component: Temp000002RadioComponent;
  let fixture: ComponentFixture<Temp000002RadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000002RadioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000002RadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
