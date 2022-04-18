import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDatatableComponent } from './contact-datatable.component';

describe('ContactDatatableComponent', () => {
  let component: ContactDatatableComponent;
  let fixture: ComponentFixture<ContactDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
