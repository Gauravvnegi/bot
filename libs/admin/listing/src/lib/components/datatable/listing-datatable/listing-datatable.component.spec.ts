import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingDatatableComponent } from './listing-datatable.component';

describe('ListingDatatableComponent', () => {
  let component: ListingDatatableComponent;
  let fixture: ComponentFixture<ListingDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
