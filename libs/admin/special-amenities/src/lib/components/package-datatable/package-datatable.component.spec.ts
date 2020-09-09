import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDatatableComponent } from './package-datatable.component';

describe('PackageDatatableComponent', () => {
  let component: PackageDatatableComponent;
  let fixture: ComponentFixture<PackageDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
