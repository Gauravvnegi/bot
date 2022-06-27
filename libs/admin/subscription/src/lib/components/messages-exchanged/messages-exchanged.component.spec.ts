import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesExchangedComponent } from './messages-exchanged.component';

describe('MessagesExchangedComponent', () => {
  let component: MessagesExchangedComponent;
  let fixture: ComponentFixture<MessagesExchangedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesExchangedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesExchangedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
