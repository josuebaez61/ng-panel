import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesChips } from './user-roles-chips';

describe('UserRolesChips', () => {
  let component: UserRolesChips;
  let fixture: ComponentFixture<UserRolesChips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRolesChips]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRolesChips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
