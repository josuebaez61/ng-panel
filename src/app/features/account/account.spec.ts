import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Account } from './account';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { provideTranslateTestingConfig, provideLanguageOptions } from '@core/providers';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('Account', () => {
  let component: Account;
  let fixture: ComponentFixture<Account>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideTranslateTestingConfig(),
        MessageService,
        DialogService,
        ConfirmationService,
        provideLanguageOptions(),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Account);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
