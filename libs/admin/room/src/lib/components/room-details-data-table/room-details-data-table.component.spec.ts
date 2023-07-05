import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDetailsDataTableComponent } from './room-details-data-table.component';

describe('RoomDetailsDataTableComponent', () => {
  let component: RoomDetailsDataTableComponent;
  let fixture: ComponentFixture<RoomDetailsDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomDetailsDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomDetailsDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
