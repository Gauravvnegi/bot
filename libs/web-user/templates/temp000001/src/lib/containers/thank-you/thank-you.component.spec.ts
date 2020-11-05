import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouMain } from './thank-you-main.component';

describe('ThankYouComponent', () => {
  let component: ThankYouMain;
  let fixture: ComponentFixture<ThankYouMain>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankYouMain ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankYouMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
