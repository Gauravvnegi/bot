import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateGraphComponent } from './rate-graph.component';

describe('RateGraphComponent', () => {
  let component: RateGraphComponent;
  let fixture: ComponentFixture<RateGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
