import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGuestListComponent } from './add-guest-list.component';

describe('AddGuestListComponent', () => {
  let component: AddGuestListComponent;
  let fixture: ComponentFixture<AddGuestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGuestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGuestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
