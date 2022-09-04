import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrLoginComponent } from './cr-login.component';

describe('CrLoginComponent', () => {
  let component: CrLoginComponent;
  let fixture: ComponentFixture<CrLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
