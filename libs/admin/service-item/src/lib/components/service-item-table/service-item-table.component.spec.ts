import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceItemTableComponent } from './service-item-table.component';

describe('ServiceItemTableComponent', () => {
  let component: ServiceItemTableComponent;
  let fixture: ComponentFixture<ServiceItemTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceItemTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
