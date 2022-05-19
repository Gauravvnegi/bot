import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentBarGraphComponent } from './department-bar-graph.component';

describe('DepartmentBarGraphComponent', () => {
  let component: DepartmentBarGraphComponent;
  let fixture: ComponentFixture<DepartmentBarGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentBarGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
