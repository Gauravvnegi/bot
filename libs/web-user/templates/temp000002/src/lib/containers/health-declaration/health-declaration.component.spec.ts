import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthDeclarationComponent } from './health-declaration.component';

describe('HealthDeclarationComponent', () => {
  let component: HealthDeclarationComponent;
  let fixture: ComponentFixture<HealthDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthDeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
