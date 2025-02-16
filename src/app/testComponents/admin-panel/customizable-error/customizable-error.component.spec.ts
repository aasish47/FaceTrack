import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizableErrorComponent } from './customizable-error.component';

describe('CustomizableErrorComponent', () => {
  let component: CustomizableErrorComponent;
  let fixture: ComponentFixture<CustomizableErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizableErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizableErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
