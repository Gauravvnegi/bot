import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribersGraphComponent } from './subscribers-graph.component';

describe('SubscribersGraphComponent', () => {
  let component: SubscribersGraphComponent;
  let fixture: ComponentFixture<SubscribersGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribersGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribersGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
