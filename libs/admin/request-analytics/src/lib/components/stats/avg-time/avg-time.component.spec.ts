import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgTimeComponent } from './avg-time.component';

describe('AvgTimeComponent', () => {
  let component: AvgTimeComponent;
  let fixture: ComponentFixture<AvgTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
