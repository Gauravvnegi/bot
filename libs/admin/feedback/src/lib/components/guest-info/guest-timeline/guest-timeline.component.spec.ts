import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestTimelineComponent } from './guest-timeline.component';

describe('GuestTimelineComponent', () => {
  let component: GuestTimelineComponent;
  let fixture: ComponentFixture<GuestTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
