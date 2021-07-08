import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageAnalyticsComponent } from './message-analytics.component';

describe('MessageAnalyticsComponent', () => {
  let component: MessageAnalyticsComponent;
  let fixture: ComponentFixture<MessageAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
