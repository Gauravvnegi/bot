import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000001StepperComponent } from './temp000001-stepper.component';

describe('Temp000001StepperComponent', () => {
  let component: Temp000001StepperComponent;
  let fixture: ComponentFixture<Temp000001StepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000001StepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000001StepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
