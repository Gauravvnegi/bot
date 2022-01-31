import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsAcrossServicesComponent } from './nps-across-services.component';

describe('NpsAcrossServicesComponent', () => {
  let component: NpsAcrossServicesComponent;
  let fixture: ComponentFixture<NpsAcrossServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpsAcrossServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsAcrossServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
