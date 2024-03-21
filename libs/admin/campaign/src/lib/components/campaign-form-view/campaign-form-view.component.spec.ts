import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignFormViewComponent } from './campaign-form-view.component';

describe('CampaignFormViewComponent', () => {
  let component: CampaignFormViewComponent;
  let fixture: ComponentFixture<CampaignFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignFormViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
