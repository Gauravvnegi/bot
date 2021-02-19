import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000001SignatureCaptureWrapperComponent } from './temp000001-signature-capture-wrapper.component';

describe('Temp000001SignatureCaptureWrapperComponent', () => {
  let component: Temp000001SignatureCaptureWrapperComponent;
  let fixture: ComponentFixture<Temp000001SignatureCaptureWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000001SignatureCaptureWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000001SignatureCaptureWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
