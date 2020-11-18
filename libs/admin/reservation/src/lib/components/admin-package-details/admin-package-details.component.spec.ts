import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPackageDetailsComponent } from './admin-package-details.component';

describe('AdminPackageDetailsComponent', () => {
  let component: AdminPackageDetailsComponent;
  let fixture: ComponentFixture<AdminPackageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPackageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPackageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
