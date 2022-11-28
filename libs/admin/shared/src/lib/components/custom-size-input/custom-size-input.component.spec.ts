import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSizeInputComponent } from './custom-size-input.component';

describe('CustomSizeInputComponent', () => {
  let component: CustomSizeInputComponent;
  let fixture: ComponentFixture<CustomSizeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSizeInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSizeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
