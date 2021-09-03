import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallReceivedBifurcationComponent } from './overall-received-bifurcation.component';

describe('OverallReceivedBifurcationComponent', () => {
  let component: OverallReceivedBifurcationComponent;
  let fixture: ComponentFixture<OverallReceivedBifurcationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallReceivedBifurcationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallReceivedBifurcationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
