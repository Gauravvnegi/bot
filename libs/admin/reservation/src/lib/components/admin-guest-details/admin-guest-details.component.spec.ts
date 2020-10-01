import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGuestDetailsComponent } from './admin-guest-details.component';

describe('AdminGuestDetailsComponent', () => {
  let component: AdminGuestDetailsComponent;
  let fixture: ComponentFixture<AdminGuestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGuestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGuestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
