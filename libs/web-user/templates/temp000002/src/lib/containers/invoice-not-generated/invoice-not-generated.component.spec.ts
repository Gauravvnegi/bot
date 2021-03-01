import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceNotGeneratedComponent } from './invoice-not-generated.component';

describe('InvoiceNotGeneratedComponent', () => {
  let component: InvoiceNotGeneratedComponent;
  let fixture: ComponentFixture<InvoiceNotGeneratedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceNotGeneratedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceNotGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
