import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUpdateFormComponent } from './bulk-update-form.component';

describe('BulkUpdateFormComponent', () => {
  let component: BulkUpdateFormComponent;
  let fixture: ComponentFixture<BulkUpdateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUpdateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
