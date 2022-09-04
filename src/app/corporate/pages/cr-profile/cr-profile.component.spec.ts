import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrProfileComponent } from './cr-profile.component';

describe('CrProfileComponent', () => {
  let component: CrProfileComponent;
  let fixture: ComponentFixture<CrProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
