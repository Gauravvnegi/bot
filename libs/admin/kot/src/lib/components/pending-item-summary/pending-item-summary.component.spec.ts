import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingItemSummaryComponent } from './pending-item-summary.component';

describe('PendingItemSummaryComponent', () => {
  let component: PendingItemSummaryComponent;
  let fixture: ComponentFixture<PendingItemSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingItemSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingItemSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
