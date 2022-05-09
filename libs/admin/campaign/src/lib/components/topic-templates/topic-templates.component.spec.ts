import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicTemplatesComponent } from './topic-templates.component';

describe('TopicTemplatesComponent', () => {
  let component: TopicTemplatesComponent;
  let fixture: ComponentFixture<TopicTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
