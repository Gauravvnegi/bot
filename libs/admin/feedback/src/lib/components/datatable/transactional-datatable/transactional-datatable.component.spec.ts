import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionalDatatableComponent } from './transactional-datatable.component';

describe('TransactionalDatatableComponent', () => {
  let component: TransactionalDatatableComponent;
  let fixture: ComponentFixture<TransactionalDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionalDatatableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionalDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
