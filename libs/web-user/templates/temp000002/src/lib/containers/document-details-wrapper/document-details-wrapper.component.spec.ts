import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDetailsWrapperComponent } from './document-details-wrapper.component';

describe('DocumentDetailsWrapperComponent', () => {
  let component: DocumentDetailsWrapperComponent;
  let fixture: ComponentFixture<DocumentDetailsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentDetailsWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDetailsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
