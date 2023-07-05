import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDataTableComponent } from './menu-data-table.component';

describe('MenuDataTableComponent', () => {
  let component: MenuDataTableComponent;
  let fixture: ComponentFixture<MenuDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
