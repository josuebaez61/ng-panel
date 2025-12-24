import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissions } from './role-permissions';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { provideTranslateTestingConfig } from '@core/providers';

describe('RolePermissions', () => {
  let component: RolePermissions;
  let fixture: ComponentFixture<RolePermissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePermissions],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        provideTranslateTestingConfig(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RolePermissions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
