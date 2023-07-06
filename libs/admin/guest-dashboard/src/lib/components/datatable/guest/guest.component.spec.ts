import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDatatableComponent } from './guest.component';

describe('GuestDatatableComponent', () => {
  let component: GuestDatatableComponent;
  let fixture: ComponentFixture<GuestDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuestDatatableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
