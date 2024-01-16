import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTabHeaderComponent } from './custom-tab-header.component';

describe('CustomTabHeaderComponent', () => {
  let component: CustomTabHeaderComponent;
  let fixture: ComponentFixture<CustomTabHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTabHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTabHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
