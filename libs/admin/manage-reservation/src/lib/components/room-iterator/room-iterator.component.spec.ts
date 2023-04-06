import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomIteratorComponent } from './room-iterator.component';

describe('RoomIteratorComponent', () => {
  let component: RoomIteratorComponent;
  let fixture: ComponentFixture<RoomIteratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomIteratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomIteratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
