import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDropdownComponent } from './to-dropdown.component';

describe('ToDropdownComponent', () => {
  let component: ToDropdownComponent;
  let fixture: ComponentFixture<ToDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
