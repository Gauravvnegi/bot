import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleDropdownComponent } from './toggle-dropdown.component';

describe('ToggleDropdownComponent', () => {
  let component: ToggleDropdownComponent;
  let fixture: ComponentFixture<ToggleDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
