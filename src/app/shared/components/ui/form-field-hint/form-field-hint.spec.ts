import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldHint } from './form-field-hint';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('FormFieldHint', () => {
  let component: FormFieldHint;
  let fixture: ComponentFixture<FormFieldHint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldHint],
      providers: [provideZonelessChangeDetection(), provideNoopAnimations()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldHint);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
