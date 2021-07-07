import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappMessageAnalyticsComponent } from './whatsapp-message-analytics.component';

describe('WhatsappMessageAnalyticsComponent', () => {
  let component: WhatsappMessageAnalyticsComponent;
  let fixture: ComponentFixture<WhatsappMessageAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappMessageAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappMessageAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
