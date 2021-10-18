import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MulticolorCircularProgressComponent } from './multicolor-circular-progress.component';

describe('MulticolorCircularProgressComponent', () => {
  let component: MulticolorCircularProgressComponent;
  let fixture: ComponentFixture<MulticolorCircularProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MulticolorCircularProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MulticolorCircularProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
