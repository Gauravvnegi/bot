import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000001InputPopupComponent } from './temp000001-input-popup.component';

describe('Temp000001InputPopupComponent', () => {
  let component: Temp000001InputPopupComponent;
  let fixture: ComponentFixture<Temp000001InputPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000001InputPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000001InputPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
