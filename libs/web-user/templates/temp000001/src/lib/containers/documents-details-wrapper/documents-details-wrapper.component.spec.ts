import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsDetailsWrapperComponent } from './documents-details-wrapper.component';

describe('DocumentsDetailsWrapperComponent', () => {
  let component: DocumentsDetailsWrapperComponent;
  let fixture: ComponentFixture<DocumentsDetailsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsDetailsWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsDetailsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
