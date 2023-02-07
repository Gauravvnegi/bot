import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDataTableComponent } from './room-data-table.component';

describe('RoomDataTableComponent', () => {
  let component: RoomDataTableComponent;
  let fixture: ComponentFixture<RoomDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
