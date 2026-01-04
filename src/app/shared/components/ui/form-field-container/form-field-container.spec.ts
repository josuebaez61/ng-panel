import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldContainer } from './form-field-container';
import { provideZonelessChangeDetection } from '@angular/core';

describe('FormFieldContainer', () => {
  let component: FormFieldContainer;
  let fixture: ComponentFixture<FormFieldContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldContainer],
      providers: [provideZonelessChangeDetection()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
