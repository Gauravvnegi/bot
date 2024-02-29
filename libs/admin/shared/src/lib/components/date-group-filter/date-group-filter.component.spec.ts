import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateGroupFilterComponent } from './date-group-filter.component';

describe('DateGroupFilterComponent', () => {
  let component: DateGroupFilterComponent;
  let fixture: ComponentFixture<DateGroupFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateGroupFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateGroupFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
