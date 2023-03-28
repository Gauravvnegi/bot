import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentsOverTimeComponent } from './sentiments-over-time.component';

describe('SentimentsOverTimeComponent', () => {
  let component: SentimentsOverTimeComponent;
  let fixture: ComponentFixture<SentimentsOverTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentimentsOverTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentimentsOverTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
