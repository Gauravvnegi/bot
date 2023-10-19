import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageHandlingComponent } from './image-handling.component';

describe('ImageHandlingComponent', () => {
  let component: ImageHandlingComponent;
  let fixture: ComponentFixture<ImageHandlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageHandlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
