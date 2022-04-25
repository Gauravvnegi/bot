import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreCheckInComponent } from './pre-check-in.component';

describe('PreCheckInComponent', () => {
  let component: PreCheckInComponent;
  let fixture: ComponentFixture<PreCheckInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreCheckInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
