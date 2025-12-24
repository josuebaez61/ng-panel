import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTable } from './users-table';
import { provideZonelessChangeDetection } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { provideTranslateTestingConfig } from '@core/providers';

describe('UsersTable', () => {
  let component: UsersTable;
  let fixture: ComponentFixture<UsersTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTable, MessageModule],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        provideTranslateTestingConfig(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
