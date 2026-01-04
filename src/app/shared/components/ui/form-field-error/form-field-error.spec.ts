import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldError } from './form-field-error';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl } from '@angular/forms';

describe('FormFieldError', () => {
  let component: FormFieldError;
  let fixture: ComponentFixture<FormFieldError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldError],
      providers: [provideZonelessChangeDetection()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldError);
    component = fixture.componentInstance;
    // Set required input
    fixture.componentRef.setInput('control', new FormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
