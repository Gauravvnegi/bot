import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSiteDataTableComponent } from './manage-site-data-table.component';

describe('ManageSiteDataTableComponent', () => {
  let component: ManageSiteDataTableComponent;
  let fixture: ComponentFixture<ManageSiteDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSiteDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSiteDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
