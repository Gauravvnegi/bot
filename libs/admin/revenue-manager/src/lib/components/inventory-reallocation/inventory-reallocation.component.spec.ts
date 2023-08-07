import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReallocationComponent } from './inventory-reallocation.component';

describe('InventoryReallocationComponent', () => {
  let component: InventoryReallocationComponent;
  let fixture: ComponentFixture<InventoryReallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryReallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
