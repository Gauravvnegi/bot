import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomUpgradeComponent } from './room-upgrade.component';

describe('RoomUpgradeComponent', () => {
  let component: RoomUpgradeComponent;
  let fixture: ComponentFixture<RoomUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
