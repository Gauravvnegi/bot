import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDatatableComponent } from './template-datatable.component';

describe('TemplateDatatableComponent', () => {
  let component: TemplateDatatableComponent;
  let fixture: ComponentFixture<TemplateDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
