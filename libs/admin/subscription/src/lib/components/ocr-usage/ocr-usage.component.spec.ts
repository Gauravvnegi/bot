import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrUsageComponent } from './ocr-usage.component';

describe('OcrUsageComponent', () => {
  let component: OcrUsageComponent;
  let fixture: ComponentFixture<OcrUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcrUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
