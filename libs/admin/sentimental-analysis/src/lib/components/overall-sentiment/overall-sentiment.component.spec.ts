import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallSentimentComponent } from './overall-sentiment.component';

describe('OverallSentimentComponent', () => {
  let component: OverallSentimentComponent;
  let fixture: ComponentFixture<OverallSentimentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallSentimentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallSentimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
