import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultipleRoomsComponent } from './add-multiple-rooms.component';

describe('AddMultipleRoomsComponent', () => {
  let component: AddMultipleRoomsComponent;
  let fixture: ComponentFixture<AddMultipleRoomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMultipleRoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMultipleRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
