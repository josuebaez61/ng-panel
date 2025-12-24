import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleUsers } from './role-users';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { provideTranslateTestingConfig } from '@core/providers';

describe('RoleUsers', () => {
  let component: RoleUsers;
  let fixture: ComponentFixture<RoleUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleUsers],
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

    fixture = TestBed.createComponent(RoleUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
