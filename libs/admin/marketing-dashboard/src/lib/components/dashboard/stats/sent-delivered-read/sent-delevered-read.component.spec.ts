import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentDeliveredReadComponent } from './sent-delivered-read.component';

describe('SentDeleveredReadComponent', () => {
  let component: SentDeliveredReadComponent;
  let fixture: ComponentFixture<SentDeliveredReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SentDeliveredReadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentDeliveredReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
