import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLoggedUsersComponent } from './manage-logged-users.component';

describe('ManageLoggedUsersComponent', () => {
  let component: ManageLoggedUsersComponent;
  let fixture: ComponentFixture<ManageLoggedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLoggedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLoggedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
