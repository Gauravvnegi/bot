import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageRendererComponent } from './package-renderer.component';

describe('PaidServiceComponent', () => {
  let component: PackageRendererComponent;
  let fixture: ComponentFixture<PackageRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
