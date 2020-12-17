import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesDatatableComponent } from './categories-datatable.component';

describe('CategoriesDatatableComponent', () => {
  let component: CategoriesDatatableComponent;
  let fixture: ComponentFixture<CategoriesDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
