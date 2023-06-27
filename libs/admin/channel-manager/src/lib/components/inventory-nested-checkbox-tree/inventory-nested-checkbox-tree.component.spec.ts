import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryNestedCheckboxTreeComponent } from './inventory-nested-checkbox-tree.component';

describe('InventoryNestedCheckboxTreeComponent', () => {
  let component: InventoryNestedCheckboxTreeComponent;
  let fixture: ComponentFixture<InventoryNestedCheckboxTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryNestedCheckboxTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryNestedCheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
