import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableManagementDatableComponent } from './table-management-datable.component';

describe('TableManagementDatableComponent', () => {
  let component: TableManagementDatableComponent;
  let fixture: ComponentFixture<TableManagementDatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableManagementDatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableManagementDatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
