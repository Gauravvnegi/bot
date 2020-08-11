import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseRequestWrapperComponent } from './raise-request-wrapper.component';

describe('RaiseRequestWrapperComponent', () => {
  let component: RaiseRequestWrapperComponent;
  let fixture: ComponentFixture<RaiseRequestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaiseRequestWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseRequestWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
