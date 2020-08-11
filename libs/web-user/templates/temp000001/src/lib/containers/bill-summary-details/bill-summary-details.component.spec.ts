import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSummaryDetailsComponent } from './bill-summary-details.component';

describe('SummaryDetailsComponent', () => {
  let component: BillSummaryDetailsComponent;
  let fixture: ComponentFixture<BillSummaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillSummaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
