import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000002SignatureCaptureWrapperComponent } from './temp000002-signature-capture-wrapper.component';

describe('Temp000002SignatureCaptureWrapperComponent', () => {
  let component: Temp000002SignatureCaptureWrapperComponent;
  let fixture: ComponentFixture<Temp000002SignatureCaptureWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000002SignatureCaptureWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000002SignatureCaptureWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
