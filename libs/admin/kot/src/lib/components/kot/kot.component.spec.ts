import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KotComponent } from './kot.component';

describe('KotComponent', () => {
  let component: KotComponent;
  let fixture: ComponentFixture<KotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
