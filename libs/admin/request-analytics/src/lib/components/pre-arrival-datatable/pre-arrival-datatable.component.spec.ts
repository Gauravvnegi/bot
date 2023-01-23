import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreArrivalDatatableComponent } from './pre-arrival-datatable.component';

describe('PreArrivalDatatableComponent', () => {
  let component: PreArrivalDatatableComponent;
  let fixture: ComponentFixture<PreArrivalDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreArrivalDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreArrivalDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
