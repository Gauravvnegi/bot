import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StayDetailsComponent } from './stay-details.component';

describe('StayFeedbackDetailsComponent', () => {
  let component: StayDetailsComponent;
  let fixture: ComponentFixture<StayDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StayDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
