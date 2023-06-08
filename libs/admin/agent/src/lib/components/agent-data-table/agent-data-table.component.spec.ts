import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDataTableComponent } from './agent-data-table.component';

describe('AgentDataTableComponent', () => {
  let component: AgentDataTableComponent;
  let fixture: ComponentFixture<AgentDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
