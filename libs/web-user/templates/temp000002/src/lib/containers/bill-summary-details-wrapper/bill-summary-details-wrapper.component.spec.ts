import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSummaryDetailsWrapperComponent } from './bill-summary-details-wrapper.component';

describe('BillSummaryDetailsWrapperComponent', () => {
  let component: BillSummaryDetailsWrapperComponent;
  let fixture: ComponentFixture<BillSummaryDetailsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillSummaryDetailsWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillSummaryDetailsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
