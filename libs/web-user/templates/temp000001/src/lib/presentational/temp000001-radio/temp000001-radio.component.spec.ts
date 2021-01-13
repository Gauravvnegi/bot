import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000001RadioComponent } from './temp000001-radio.component';

describe('Temp000001RadioComponent', () => {
  let component: Temp000001RadioComponent;
  let fixture: ComponentFixture<Temp000001RadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000001RadioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000001RadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
