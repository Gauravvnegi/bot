import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsOverTimeComponent } from './topics-over-time.component';

describe('TopicsOverTimeComponent', () => {
  let component: TopicsOverTimeComponent;
  let fixture: ComponentFixture<TopicsOverTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsOverTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsOverTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
