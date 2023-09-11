import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionHistoryDataTableComponent } from './transaction-history-data-table.component';

describe('TransactionHistoryDataTableComponent', () => {
  let component: TransactionHistoryDataTableComponent;
  let fixture: ComponentFixture<TransactionHistoryDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionHistoryDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionHistoryDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
