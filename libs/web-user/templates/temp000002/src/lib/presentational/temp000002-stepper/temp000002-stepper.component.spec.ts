import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000002StepperComponent } from './temp000002-stepper.component';

describe('Temp000002StepperComponent', () => {
  let component: Temp000002StepperComponent;
  let fixture: ComponentFixture<Temp000002StepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000002StepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000002StepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
