import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaFormComponent } from './spa-form.component';

describe('SpaFormComponent', () => {
  let component: SpaFormComponent;
  let fixture: ComponentFixture<SpaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
