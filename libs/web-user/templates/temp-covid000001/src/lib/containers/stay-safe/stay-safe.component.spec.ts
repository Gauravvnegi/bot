import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaySafeComponent } from './stay-safe.component';

describe('StaySafeComponent', () => {
  let component: StaySafeComponent;
  let fixture: ComponentFixture<StaySafeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaySafeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaySafeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
