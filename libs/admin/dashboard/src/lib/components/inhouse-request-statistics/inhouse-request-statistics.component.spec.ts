import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InhouseRequestStatisticsComponent } from './inhouse-request-statistics.component';

describe('InhouseRequestStatisticsComponent', () => {
  let component: InhouseRequestStatisticsComponent;
  let fixture: ComponentFixture<InhouseRequestStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InhouseRequestStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InhouseRequestStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
