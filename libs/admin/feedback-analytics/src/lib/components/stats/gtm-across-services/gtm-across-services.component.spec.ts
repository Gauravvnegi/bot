import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtmAcrossServicesComponent } from './gtm-across-services.component';

describe('GtmAcrossServicesComponent', () => {
  let component: GtmAcrossServicesComponent;
  let fixture: ComponentFixture<GtmAcrossServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtmAcrossServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtmAcrossServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
