import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateListingComponent } from './corporate-listing.component';

describe('CorporateListingComponent', () => {
  let component: CorporateListingComponent;
  let fixture: ComponentFixture<CorporateListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
