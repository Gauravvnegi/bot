import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyLinkComponentComponent } from './copy-link-component.component';

describe('CopyLinkComponentComponent', () => {
  let component: CopyLinkComponentComponent;
  let fixture: ComponentFixture<CopyLinkComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyLinkComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyLinkComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
