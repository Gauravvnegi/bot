import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InhouseSourceComponent } from './inhouse-source.component';

describe('InhouseSourceComponent', () => {
  let component: InhouseSourceComponent;
  let fixture: ComponentFixture<InhouseSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InhouseSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InhouseSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
