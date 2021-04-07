import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelUsageComponent } from './channel-usage.component';

describe('ChannelUsageComponent', () => {
  let component: ChannelUsageComponent;
  let fixture: ComponentFixture<ChannelUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
