import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryMainComponent } from './summary-main.component';

describe('SummaryMainComponent', () => {
  let component: SummaryMainComponent;
  let fixture: ComponentFixture<SummaryMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
