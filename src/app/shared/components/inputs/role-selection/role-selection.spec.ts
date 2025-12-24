import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSelection } from './role-selection';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideTranslateTestingConfig } from '@core/providers';

describe('RoleSelection', () => {
  let component: RoleSelection;
  let fixture: ComponentFixture<RoleSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleSelection],
      providers: [provideZonelessChangeDetection(), provideTranslateTestingConfig()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleSelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
