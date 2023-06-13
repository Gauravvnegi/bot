import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRatesComponent } from './update-rates.component';

describe('UpdateRatesComponent', () => {
  let component: UpdateRatesComponent;
  let fixture: ComponentFixture<UpdateRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
