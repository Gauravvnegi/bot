import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDataTableComponent } from './package-datatable.component';

describe('PackageDataTableComponent', () => {
  let component: PackageDataTableComponent;
  let fixture: ComponentFixture<PackageDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PackageDataTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
