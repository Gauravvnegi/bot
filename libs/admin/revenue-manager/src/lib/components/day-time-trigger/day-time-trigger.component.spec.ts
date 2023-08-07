import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTimeTriggerComponent } from './day-time-trigger.component';

describe('DayTimeTriggerComponent', () => {
  let component: DayTimeTriggerComponent;
  let fixture: ComponentFixture<DayTimeTriggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayTimeTriggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTimeTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
