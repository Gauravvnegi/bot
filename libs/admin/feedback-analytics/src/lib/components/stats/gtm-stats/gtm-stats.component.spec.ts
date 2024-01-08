import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtmStatsComponent } from './gtm-stats.component';

describe('GtmStatsComponent', () => {
  let component: GtmStatsComponent;
  let fixture: ComponentFixture<GtmStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtmStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtmStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
