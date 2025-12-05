import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangSelector } from './lang-selector';

describe('LangSelector', () => {
  let component: LangSelector;
  let fixture: ComponentFixture<LangSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LangSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LangSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
