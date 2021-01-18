import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouMainComponent } from './thank-you-main.component';

describe('ThankYouMainComponent', () => {
  let component: ThankYouMainComponent;
  let fixture: ComponentFixture<ThankYouMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankYouMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankYouMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
