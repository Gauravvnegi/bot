import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsAcrossTouchpointsComponent } from './nps-across-touchpoints.component';

describe('NpsAcrossTouchpointsComponent', () => {
  let component: NpsAcrossTouchpointsComponent;
  let fixture: ComponentFixture<NpsAcrossTouchpointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpsAcrossTouchpointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsAcrossTouchpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
