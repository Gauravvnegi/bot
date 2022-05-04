import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignDatatableComponent } from './campaign-datatable.component';

describe('CampaignDatableComponent', () => {
  let component: CampaignDatatableComponent;
  let fixture: ComponentFixture<CampaignDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignDatatableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
