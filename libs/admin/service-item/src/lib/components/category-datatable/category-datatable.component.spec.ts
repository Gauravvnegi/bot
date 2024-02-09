import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDatatableComponent } from './category-datatable.component';

describe('CategoryDatatableComponent', () => {
  let component: CategoryDatatableComponent;
  let fixture: ComponentFixture<CategoryDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
