import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintBifurcationComponent } from './complaint-bifurcation.component';

describe('ComplaintBifurcationComponent', () => {
  let component: ComplaintBifurcationComponent;
  let fixture: ComponentFixture<ComplaintBifurcationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintBifurcationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintBifurcationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
