import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDatatableModalComponent } from './guest-datatable.component';

describe('GuestDatatableModalComponent', () => {
  let component: GuestDatatableModalComponent;
  let fixture: ComponentFixture<GuestDatatableModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuestDatatableModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestDatatableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
