import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryWrapperComponent } from './summary-wrapper.component';

describe('SummaryWrapperComponent', () => {
  let component: SummaryWrapperComponent;
  let fixture: ComponentFixture<SummaryWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
