import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionDatatableComponent } from './user-permission-datatable.component';

describe('UserPermissionDatatableComponent', () => {
  let component: UserPermissionDatatableComponent;
  let fixture: ComponentFixture<UserPermissionDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPermissionDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPermissionDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
