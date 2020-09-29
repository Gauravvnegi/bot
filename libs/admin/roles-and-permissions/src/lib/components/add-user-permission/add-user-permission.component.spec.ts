import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserPermissionComponent } from './add-user-permission.component';

describe('AddUserPermissionComponent', () => {
  let component: AddUserPermissionComponent;
  let fixture: ComponentFixture<AddUserPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
