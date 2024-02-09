import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KotTableComponent } from './kot-table.component';

describe('KotTableComponent', () => {
  let component: KotTableComponent;
  let fixture: ComponentFixture<KotTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KotTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
