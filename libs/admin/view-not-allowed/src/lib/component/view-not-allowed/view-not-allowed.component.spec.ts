import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNotAllowedComponent } from './view-not-allowed.component';

describe('ViewNotAllowedComponent', () => {
  let component: ViewNotAllowedComponent;
  let fixture: ComponentFixture<ViewNotAllowedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewNotAllowedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNotAllowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
