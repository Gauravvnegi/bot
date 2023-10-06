import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLoginUsersComponent } from './manage-login-users.component';

describe('ManageLoginUsersComponent', () => {
  let component: ManageLoginUsersComponent;
  let fixture: ComponentFixture<ManageLoginUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLoginUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLoginUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
