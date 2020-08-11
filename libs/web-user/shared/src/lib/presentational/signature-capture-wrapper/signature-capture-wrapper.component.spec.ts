import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureCaptureWrapperComponent } from './signature-capture-wrapper.component';

describe('SignatureCaptureContainerComponent', () => {
  let component: SignatureCaptureWrapperComponent;
  let fixture: ComponentFixture<SignatureCaptureWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureCaptureWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureCaptureWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
