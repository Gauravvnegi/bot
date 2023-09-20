import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExCheckinSidebarComponent } from './ex-checkin-sidebar.component';

describe('ExCheckinSidebarComponent', () => {
  let component: ExCheckinSidebarComponent;
  let fixture: ComponentFixture<ExCheckinSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExCheckinSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExCheckinSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
