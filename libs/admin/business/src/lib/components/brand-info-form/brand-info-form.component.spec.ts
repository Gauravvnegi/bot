import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandInfoFormComponent } from './brand-info-form.component';

describe('BrandInfoFormComponent', () => {
  let component: BrandInfoFormComponent;
  let fixture: ComponentFixture<BrandInfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandInfoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
