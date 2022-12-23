import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingAndSeoComponent } from './marketing-and-seo.component';

describe('MarketingAndSeoComponent', () => {
  let component: MarketingAndSeoComponent;
  let fixture: ComponentFixture<MarketingAndSeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingAndSeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingAndSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
