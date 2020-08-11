import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturePadScribbleComponent } from './signature-pad-scribble.component';

describe('SignaturePadComponent', () => {
  let component: SignaturePadScribbleComponent;
  let fixture: ComponentFixture<SignaturePadScribbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignaturePadScribbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignaturePadScribbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
