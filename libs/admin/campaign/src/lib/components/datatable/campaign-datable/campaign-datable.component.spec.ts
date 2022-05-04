import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignDatableComponent } from './campaign-datable.component';

describe('CampaignDatableComponent', () => {
  let component: CampaignDatableComponent;
  let fixture: ComponentFixture<CampaignDatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignDatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignDatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
