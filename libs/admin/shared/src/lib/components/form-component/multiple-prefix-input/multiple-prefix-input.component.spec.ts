import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplePrefixInputComponent } from './multiple-prefix-input.component';

describe('MultiplePrefixInputComponent', () => {
  let component: MultiplePrefixInputComponent;
  let fixture: ComponentFixture<MultiplePrefixInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiplePrefixInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplePrefixInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
