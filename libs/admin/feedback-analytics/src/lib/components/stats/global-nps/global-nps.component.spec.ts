import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNpsComponent } from './global-nps.component';

describe('GlobalNpsComponent', () => {
  let component: GlobalNpsComponent;
  let fixture: ComponentFixture<GlobalNpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalNpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalNpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
