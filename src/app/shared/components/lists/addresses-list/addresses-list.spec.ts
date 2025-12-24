import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressesList } from './addresses-list';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideTranslateTestingConfig } from '@core/providers';

describe('AddressesList', () => {
  let component: AddressesList;
  let fixture: ComponentFixture<AddressesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressesList],
      providers: [provideZonelessChangeDetection(), provideTranslateTestingConfig()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
