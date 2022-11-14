import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InhouseRequestDatatableComponent } from './inhouse-request-datatable.component';

describe('InhouseRequestDatatableComponent', () => {
  let component: InhouseRequestDatatableComponent;
  let fixture: ComponentFixture<InhouseRequestDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InhouseRequestDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InhouseRequestDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
