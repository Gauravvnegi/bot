import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestPersonalInfoComponent } from './guest-personal-info.component';

describe('GuestPersonalInfoComponent', () => {
  let component: GuestPersonalInfoComponent;
  let fixture: ComponentFixture<GuestPersonalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestPersonalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
