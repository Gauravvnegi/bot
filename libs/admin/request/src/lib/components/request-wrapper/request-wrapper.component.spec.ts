import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWrapperComponent } from './request-wrapper.component';

describe('RequestWrapperComponent', () => {
  let component: RequestWrapperComponent;
  let fixture: ComponentFixture<RequestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
