import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSelectboxComponent } from './search-selectbox.component';

describe('SearchSelectboxComponent', () => {
  let component: SearchSelectboxComponent;
  let fixture: ComponentFixture<SearchSelectboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSelectboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSelectboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
