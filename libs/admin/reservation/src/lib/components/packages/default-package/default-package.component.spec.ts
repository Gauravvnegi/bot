import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPackageComponent } from './default-package.component';

describe('DefaultPackageComponent', () => {
  let component: DefaultPackageComponent;
  let fixture: ComponentFixture<DefaultPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
