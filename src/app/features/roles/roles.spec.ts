import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Roles } from './roles';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { provideTranslateTestingConfig } from '@core/providers';

describe('Roles', () => {
  let component: Roles;
  let fixture: ComponentFixture<Roles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Roles],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        DialogService,
        ConfirmationService,
        provideTranslateTestingConfig(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Roles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
