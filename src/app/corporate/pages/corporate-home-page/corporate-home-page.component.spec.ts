import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateHomePageComponent } from './corporate-home-page.component';

describe('CorporateHomePageComponent', () => {
  let component: CorporateHomePageComponent;
  let fixture: ComponentFixture<CorporateHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateHomePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
