import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000001CustomStepperComponent } from './temp000001-custom-stepper.component';

describe('Temp000001CustomStepperComponent', () => {
  let component: Temp000001CustomStepperComponent;
  let fixture: ComponentFixture<Temp000001CustomStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000001CustomStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000001CustomStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
