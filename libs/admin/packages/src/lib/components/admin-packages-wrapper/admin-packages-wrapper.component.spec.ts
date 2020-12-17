import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPackagesWrapperComponent } from './admin-packages-wrapper.component';

describe('AdminPackagesWrapperComponent', () => {
  let component: AdminPackagesWrapperComponent;
  let fixture: ComponentFixture<AdminPackagesWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPackagesWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPackagesWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
