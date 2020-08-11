import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateRendererComponent } from './template-renderer.component';

describe('TemplateRendererComponent', () => {
  let component: TemplateRendererComponent;
  let fixture: ComponentFixture<TemplateRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
