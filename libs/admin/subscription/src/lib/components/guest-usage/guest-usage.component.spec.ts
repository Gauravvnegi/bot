import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestUsageComponent } from './guest-usage.component';

describe('GuestUsageComponent', () => {
  let component: GuestUsageComponent;
  let fixture: ComponentFixture<GuestUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
