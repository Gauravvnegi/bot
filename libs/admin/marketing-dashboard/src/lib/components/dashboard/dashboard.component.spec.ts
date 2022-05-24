import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingDashboardComponent } from './dashboard.component';

describe('MarketingDashboardComponent', () => {
  let component: MarketingDashboardComponent;
  let fixture: ComponentFixture<MarketingDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketingDashboardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
