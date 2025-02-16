import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLogsComponent } from './user-logs.component';

describe('UserLogsComponent', () => {
  let component: UserLogsComponent;
  let fixture: ComponentFixture<UserLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
