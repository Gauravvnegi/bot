import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceHistoryDataTableComponent } from './invoice-history-data-table.component';

describe('InvoiceHistoryDataTableComponent', () => {
  let component: InvoiceHistoryDataTableComponent;
  let fixture: ComponentFixture<InvoiceHistoryDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceHistoryDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceHistoryDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
