import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StayDetailsWrapperComponent } from './stay-details-wrapper.component';

describe('StayDetailsWrapperComponent', () => {
  let component: StayDetailsWrapperComponent;
  let fixture: ComponentFixture<StayDetailsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StayDetailsWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StayDetailsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
