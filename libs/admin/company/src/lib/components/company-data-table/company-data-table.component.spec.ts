import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDataTableComponent } from './company-data-table.component';

describe('CompanyDataTableComponent', () => {
  let component: CompanyDataTableComponent;
  let fixture: ComponentFixture<CompanyDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
