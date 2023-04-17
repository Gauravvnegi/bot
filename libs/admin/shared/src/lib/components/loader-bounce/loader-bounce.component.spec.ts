import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderBounceComponent } from './loader-bounce.component';

describe('LoaderBounceComponent', () => {
  let component: LoaderBounceComponent;
  let fixture: ComponentFixture<LoaderBounceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderBounceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderBounceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
