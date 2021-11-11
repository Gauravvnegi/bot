import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestListFilterComponent } from './request-list-filter.component';

describe('RequestListFilterComponent', () => {
  let component: RequestListFilterComponent;
  let fixture: ComponentFixture<RequestListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
