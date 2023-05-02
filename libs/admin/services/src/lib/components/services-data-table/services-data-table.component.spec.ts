import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDataTableComponent } from './services-data-table.component';

describe('ServicesDataTableComponent', () => {
  let component: ServicesDataTableComponent;
  let fixture: ComponentFixture<ServicesDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
