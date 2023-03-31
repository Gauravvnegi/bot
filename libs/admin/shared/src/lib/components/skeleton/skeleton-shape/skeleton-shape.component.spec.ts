import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonShapeComponent } from './skeleton-shape.component';

describe('SkeletonShapeComponent', () => {
  let component: SkeletonShapeComponent;
  let fixture: ComponentFixture<SkeletonShapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkeletonShapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
