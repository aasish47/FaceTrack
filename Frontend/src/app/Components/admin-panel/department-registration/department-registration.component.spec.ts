import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentRegistrationComponent } from './department-registration.component';

describe('DepartmentRegistrationComponent', () => {
  let component: DepartmentRegistrationComponent;
  let fixture: ComponentFixture<DepartmentRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
