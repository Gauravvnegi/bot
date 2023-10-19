import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDocumentsStatisticsComponent } from './guest-documents-statistics.component';

describe('GuestDocumentsStatisticsComponent', () => {
  let component: GuestDocumentsStatisticsComponent;
  let fixture: ComponentFixture<GuestDocumentsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestDocumentsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestDocumentsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
