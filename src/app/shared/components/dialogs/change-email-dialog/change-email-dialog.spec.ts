import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEmailDialog } from './change-email-dialog';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { provideTranslateTestingConfig } from '@core/providers';

describe('ChangeEmailDialog', () => {
  let component: ChangeEmailDialog;
  let fixture: ComponentFixture<ChangeEmailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeEmailDialog],
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

    fixture = TestBed.createComponent(ChangeEmailDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
