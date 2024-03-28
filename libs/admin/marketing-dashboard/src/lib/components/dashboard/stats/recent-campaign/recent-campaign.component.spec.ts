import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentCampaignComponent } from './recent-campaign.component';

describe('RecentCampaignComponent', () => {
  let component: RecentCampaignComponent;
  let fixture: ComponentFixture<RecentCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
