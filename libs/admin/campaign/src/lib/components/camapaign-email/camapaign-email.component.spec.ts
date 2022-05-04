import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignEmailComponent } from './camapaign-email.component';

describe('CampaignEmailComponent', () => {
  let component: CampaignEmailComponent;
  let fixture: ComponentFixture<CampaignEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
