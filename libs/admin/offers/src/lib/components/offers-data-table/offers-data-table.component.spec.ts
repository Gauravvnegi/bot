import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersDataTableComponent } from './offers-data-table.component';

describe('OffersDataTableComponent', () => {
  let component: OffersDataTableComponent;
  let fixture: ComponentFixture<OffersDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
