import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateHtmlEditorComponent } from './template-html-editor.component';

describe('TemplateHtmlEditorComponent', () => {
  let component: TemplateHtmlEditorComponent;
  let fixture: ComponentFixture<TemplateHtmlEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateHtmlEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateHtmlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
