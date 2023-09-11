import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOutletsDataTableComponent } from './all-outlets-data-table.component';

describe('AllOutletsDataTableComponent', () => {
  let component: AllOutletsDataTableComponent;
  let fixture: ComponentFixture<AllOutletsDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllOutletsDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllOutletsDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
