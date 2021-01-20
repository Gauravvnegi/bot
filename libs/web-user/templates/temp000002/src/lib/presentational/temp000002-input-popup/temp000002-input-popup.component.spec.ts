import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000002InputPopupComponent } from './temp000002-input-popup.component';

describe('Temp000002InputPopupComponent', () => {
  let component: Temp000002InputPopupComponent;
  let fixture: ComponentFixture<Temp000002InputPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000002InputPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000002InputPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
