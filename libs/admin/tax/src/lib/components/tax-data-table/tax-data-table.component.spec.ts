import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxDataTableComponent } from './tax-data-table.component';

describe('TaxDataTableComponent', () => {
  let component: TaxDataTableComponent;
  let fixture: ComponentFixture<TaxDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
