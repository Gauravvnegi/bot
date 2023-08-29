import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTabFilterComponent } from './entity-tab-filter.component';

describe('EntityTabFilterComponent', () => {
  let component: EntityTabFilterComponent;
  let fixture: ComponentFixture<EntityTabFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityTabFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTabFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
