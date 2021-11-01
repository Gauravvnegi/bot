import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreArrivalComponent } from './pre-arrival.component';

describe('PreArrivalComponent', () => {
  let component: PreArrivalComponent;
  let fixture: ComponentFixture<PreArrivalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreArrivalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
