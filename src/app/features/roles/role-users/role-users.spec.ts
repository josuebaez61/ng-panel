import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleUsers } from './role-users';

describe('RoleUsers', () => {
  let component: RoleUsers;
  let fixture: ComponentFixture<RoleUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
