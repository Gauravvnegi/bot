import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentsRatingComponent } from './sentiments-rating.component';

describe('SentimentsRatingComponent', () => {
  let component: SentimentsRatingComponent;
  let fixture: ComponentFixture<SentimentsRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentimentsRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentimentsRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
