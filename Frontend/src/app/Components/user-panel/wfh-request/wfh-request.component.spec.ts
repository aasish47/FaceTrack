import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfhRequestComponent } from './wfh-request.component';

describe('WfhRequestComponent', () => {
  let component: WfhRequestComponent;
  let fixture: ComponentFixture<WfhRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WfhRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WfhRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
