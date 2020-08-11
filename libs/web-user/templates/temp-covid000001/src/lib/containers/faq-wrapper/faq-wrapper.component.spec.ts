import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqWrapperComponent } from './faq-wrapper.component';

describe('FaqWrapperComponent', () => {
  let component: FaqWrapperComponent;
  let fixture: ComponentFixture<FaqWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
