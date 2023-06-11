import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletsDataTableComponent } from './outlets-data-table.component';

describe('OutletsDataTableComponent', () => {
  let component: OutletsDataTableComponent;
  let fixture: ComponentFixture<OutletsDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletsDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletsDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
