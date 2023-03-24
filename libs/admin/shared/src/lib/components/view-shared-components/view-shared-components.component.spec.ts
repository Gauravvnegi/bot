import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSharedComponentsComponent } from './view-shared-components.component';

describe('ViewSharedComponentsComponent', () => {
  let component: ViewSharedComponentsComponent;
  let fixture: ComponentFixture<ViewSharedComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSharedComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSharedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
