import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsDataTableComponent } from './reports-data-table.component';

describe('ReportsDataTableComponent', () => {
  let component: ReportsDataTableComponent;
  let fixture: ComponentFixture<ReportsDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsDataTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
