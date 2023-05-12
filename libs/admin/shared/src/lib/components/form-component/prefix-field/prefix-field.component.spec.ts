import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefixFieldComponent } from './prefix-field.component';

describe('PrefixFieldComponent', () => {
  let component: PrefixFieldComponent;
  let fixture: ComponentFixture<PrefixFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefixFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefixFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
