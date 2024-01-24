import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KotDataTableComponent } from './kot-data-table.component';

describe('KotDataTableComponent', () => {
  let component: KotDataTableComponent;
  let fixture: ComponentFixture<KotDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KotDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
