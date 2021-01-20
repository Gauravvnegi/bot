import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000002ButtonComponent } from './temp000002-button.component';

describe('Temp000002ButtonComponent', () => {
  let component: Temp000002ButtonComponent;
  let fixture: ComponentFixture<Temp000002ButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000002ButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000002ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
