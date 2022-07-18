import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionOverlayComponent } from './action-overlay.component';

describe('ActionOverlayComponent', () => {
  let component: ActionOverlayComponent;
  let fixture: ComponentFixture<ActionOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
