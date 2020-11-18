import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientationPopupComponent } from './orientation-popup.component';

describe('OrientationPopupComponent', () => {
  let component: OrientationPopupComponent;
  let fixture: ComponentFixture<OrientationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrientationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
