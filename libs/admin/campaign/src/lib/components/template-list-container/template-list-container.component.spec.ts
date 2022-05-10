import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateListContainerComponent } from './template-list-container.component';

describe('TemplateListContainerComponent', () => {
  let component: TemplateListContainerComponent;
  let fixture: ComponentFixture<TemplateListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateListContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
