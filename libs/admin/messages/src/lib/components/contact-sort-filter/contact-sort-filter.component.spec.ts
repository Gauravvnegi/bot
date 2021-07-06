import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSortFilterComponent } from './contact-sort-filter.component';

describe('ContactSortFilterComponent', () => {
  let component: ContactSortFilterComponent;
  let fixture: ComponentFixture<ContactSortFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactSortFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSortFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
