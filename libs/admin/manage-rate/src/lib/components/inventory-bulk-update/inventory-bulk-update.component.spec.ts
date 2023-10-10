import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBulkUpdateComponent } from './inventory-bulk-update.component';

describe('InventoryBulkUpdateComponent', () => {
  let component: InventoryBulkUpdateComponent;
  let fixture: ComponentFixture<InventoryBulkUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryBulkUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryBulkUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
