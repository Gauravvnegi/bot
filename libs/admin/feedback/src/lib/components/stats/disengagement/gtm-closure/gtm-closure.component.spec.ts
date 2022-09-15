import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtmClosureComponent } from './gtm-closure.component';

describe('GtmClosureComponent', () => {
  let component: GtmClosureComponent;
  let fixture: ComponentFixture<GtmClosureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GtmClosureComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtmClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
