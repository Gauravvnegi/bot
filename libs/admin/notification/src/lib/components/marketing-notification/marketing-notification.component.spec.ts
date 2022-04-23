import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingNotificationComponent } from './marketing-notification.component';

describe('MarketingNotificationComponent', () => {
  let component: MarketingNotificationComponent;
  let fixture: ComponentFixture<MarketingNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
