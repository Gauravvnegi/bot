import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Temp000001ButtonComponent } from './temp000001-button.component';

describe('Temp000001ButtonComponent', () => {
  let component: Temp000001ButtonComponent;
  let fixture: ComponentFixture<Temp000001ButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Temp000001ButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Temp000001ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
