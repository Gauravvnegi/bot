import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualCheckinComponent } from './manual-checkin.component';

describe('ManualCheckinComponent', () => {
  let component: ManualCheckinComponent;
  let fixture: ComponentFixture<ManualCheckinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualCheckinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
