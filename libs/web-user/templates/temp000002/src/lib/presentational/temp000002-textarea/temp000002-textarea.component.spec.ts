import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000002TextareaComponent } from './temp000002-textarea.component';

describe('Temp000002TextareaComponent', () => {
  let component: Temp000002TextareaComponent;
  let fixture: ComponentFixture<Temp000002TextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000002TextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000002TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
