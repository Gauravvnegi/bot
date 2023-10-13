import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabbedSidebarComponent } from './tabbed-sidebar.component';

describe('TabbedSidebarComponent', () => {
  let component: TabbedSidebarComponent;
  let fixture: ComponentFixture<TabbedSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabbedSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabbedSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
