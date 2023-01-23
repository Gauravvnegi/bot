import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EFrontDeskComponent } from './e-front-desk.component';

describe('EFrontDeskComponent', () => {
  let component: EFrontDeskComponent;
  let fixture: ComponentFixture<EFrontDeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EFrontDeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EFrontDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
