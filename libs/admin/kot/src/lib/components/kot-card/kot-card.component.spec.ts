import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KotCardComponent } from './kot-card.component';

describe('KotCardComponent', () => {
  let component: KotCardComponent;
  let fixture: ComponentFixture<KotCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KotCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
