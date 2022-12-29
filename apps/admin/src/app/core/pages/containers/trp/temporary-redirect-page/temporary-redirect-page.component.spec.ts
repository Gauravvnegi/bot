import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryRedirectPageComponent } from './temporary-redirect-page.component';

describe('TemporaryRedirectPageComponent', () => {
  let component: TemporaryRedirectPageComponent;
  let fixture: ComponentFixture<TemporaryRedirectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemporaryRedirectPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryRedirectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
