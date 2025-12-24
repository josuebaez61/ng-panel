import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordDialog } from './change-password-dialog';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { provideTranslateTestingConfig } from '@core/providers';

describe('ChangePasswordDialog', () => {
  let component: ChangePasswordDialog;
  let fixture: ComponentFixture<ChangePasswordDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordDialog],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        { provide: DynamicDialogRef, useValue: {} },
        provideTranslateTestingConfig(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
