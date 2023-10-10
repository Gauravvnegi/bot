import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedBreakdownComponent } from './received-breakdown.component';

describe('ReceivedBreakdownComponent', () => {
  let component: ReceivedBreakdownComponent;
  let fixture: ComponentFixture<ReceivedBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReceivedBreakdownComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
