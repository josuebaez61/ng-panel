import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesChips } from './user-roles-chips';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { provideTranslateTestingConfig } from '@core/providers';

describe('UserRolesChips', () => {
  let component: UserRolesChips;
  let fixture: ComponentFixture<UserRolesChips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRolesChips],
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

    fixture = TestBed.createComponent(UserRolesChips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
