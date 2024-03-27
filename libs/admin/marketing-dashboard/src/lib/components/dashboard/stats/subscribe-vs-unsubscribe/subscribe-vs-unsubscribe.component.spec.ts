import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeVsUnsubscribeComponent } from './subscribe-vs-unsubscribe.component';

describe('SubscribeVsUnsubscribeComponent', () => {
  let component: SubscribeVsUnsubscribeComponent;
  let fixture: ComponentFixture<SubscribeVsUnsubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeVsUnsubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeVsUnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
