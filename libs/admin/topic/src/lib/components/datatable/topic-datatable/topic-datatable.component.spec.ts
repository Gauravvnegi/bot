import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicDatatableComponent } from './topic-datatable.component';

describe('TopicDatatableComponent', () => {
  let component: TopicDatatableComponent;
  let fixture: ComponentFixture<TopicDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
