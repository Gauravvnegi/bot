import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopLowNpsComponent } from './top-low-nps.component';

describe('TopLowNpsComponent', () => {
  let component: TopLowNpsComponent;
  let fixture: ComponentFixture<TopLowNpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopLowNpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopLowNpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
