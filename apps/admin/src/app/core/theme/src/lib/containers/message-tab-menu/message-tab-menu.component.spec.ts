import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTabMenuComponent } from './message-tab-menu.component';

describe('MessageTabMenuComponent', () => {
  let component: MessageTabMenuComponent;
  let fixture: ComponentFixture<MessageTabMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageTabMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
