import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000001TextareaComponent } from './temp000001-textarea.component';

describe('Temp000001TextareaComponent', () => {
  let component: Temp000001TextareaComponent;
  let fixture: ComponentFixture<Temp000001TextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000001TextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000001TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
