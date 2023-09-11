import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletGraphsComponent } from './outlet-graphs.component';

describe('OutletGraphsComponent', () => {
  let component: OutletGraphsComponent;
  let fixture: ComponentFixture<OutletGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletGraphsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
