import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NightAuditComponent } from './night-audit.component';

describe('NightAuditComponent', () => {
  let component: NightAuditComponent;
  let fixture: ComponentFixture<NightAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NightAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NightAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
