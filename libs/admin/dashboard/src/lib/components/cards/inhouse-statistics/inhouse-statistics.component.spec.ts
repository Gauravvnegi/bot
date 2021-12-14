import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InhouseStatisticsComponent } from './inhouse-statistics.component';

describe('InhouseStatisticsComponent', () => {
  let component: InhouseStatisticsComponent;
  let fixture: ComponentFixture<InhouseStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InhouseStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InhouseStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
