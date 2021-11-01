import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreArrivalPackagesComponent } from './pre-arrival-packages.component';

describe('PreArrivalPackagesComponent', () => {
  let component: PreArrivalPackagesComponent;
  let fixture: ComponentFixture<PreArrivalPackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreArrivalPackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreArrivalPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
