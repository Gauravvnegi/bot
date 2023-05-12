import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteActionComponent } from './site-action.component';

describe('SiteActionComponent', () => {
  let component: SiteActionComponent;
  let fixture: ComponentFixture<SiteActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SiteActionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
