import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersUsageComponent } from './users-usage.component';

describe('UsersUsageComponent', () => {
  let component: UsersUsageComponent;
  let fixture: ComponentFixture<UsersUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
