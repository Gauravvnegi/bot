import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BifurcationStatsComponent } from './bifurcation-stats.component';

describe('BifurcationStatsComponent', () => {
  let component: BifurcationStatsComponent;
  let fixture: ComponentFixture<BifurcationStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BifurcationStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BifurcationStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
