import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaChatComponent } from './media-chat.component';

describe('MediaChatComponent', () => {
  let component: MediaChatComponent;
  let fixture: ComponentFixture<MediaChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
