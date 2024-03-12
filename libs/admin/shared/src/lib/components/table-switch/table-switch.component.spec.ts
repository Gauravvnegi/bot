import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSwitchComponent } from './table-switch.component';

describe('TableSwitchComponent', () => {
  let component: TableSwitchComponent;
  let fixture: ComponentFixture<TableSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
