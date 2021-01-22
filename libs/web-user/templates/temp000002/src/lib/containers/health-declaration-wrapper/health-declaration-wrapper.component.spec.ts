import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthDeclarationWrapperComponent } from './health-declaration-wrapper.component';

describe('HealthDeclarationWrapperComponent', () => {
  let component: HealthDeclarationWrapperComponent;
  let fixture: ComponentFixture<HealthDeclarationWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthDeclarationWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDeclarationWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
