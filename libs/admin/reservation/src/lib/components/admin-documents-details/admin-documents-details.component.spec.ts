import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocumentsDetailsComponent } from './admin-documents-details.component';

describe('AdminDocumentsDetailsComponent', () => {
  let component: AdminDocumentsDetailsComponent;
  let fixture: ComponentFixture<AdminDocumentsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDocumentsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocumentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
