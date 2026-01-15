import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputColor } from './input-color';
import { provideZonelessChangeDetection } from '@angular/core';

describe('InputColor', () => {
  let component: InputColor;
  let fixture: ComponentFixture<InputColor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputColor],
      providers: [provideZonelessChangeDetection()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputColor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
