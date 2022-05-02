import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InbuiltTemplateComponent } from './inbuilt-template.component';

describe('InbuiltTemplateComponent', () => {
  let component: InbuiltTemplateComponent;
  let fixture: ComponentFixture<InbuiltTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InbuiltTemplateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InbuiltTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
