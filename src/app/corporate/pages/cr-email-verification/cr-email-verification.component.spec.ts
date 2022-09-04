import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrEmailVerificationComponent } from './cr-email-verification.component';

describe('CrEmailVerificationComponent', () => {
  let component: CrEmailVerificationComponent;
  let fixture: ComponentFixture<CrEmailVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrEmailVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
