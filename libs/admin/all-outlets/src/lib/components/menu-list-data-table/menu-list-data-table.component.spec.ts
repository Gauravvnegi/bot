import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuListDataTableComponent } from './menu-list-data-table.component';

describe('MenuListDataTableComponent', () => {
  let component: MenuListDataTableComponent;
  let fixture: ComponentFixture<MenuListDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuListDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuListDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
