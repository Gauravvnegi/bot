import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentsByTopicsComponent } from './sentiments-by-topics.component';

describe('SentimentsByTopicsComponent', () => {
  let component: SentimentsByTopicsComponent;
  let fixture: ComponentFixture<SentimentsByTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentimentsByTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentimentsByTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
