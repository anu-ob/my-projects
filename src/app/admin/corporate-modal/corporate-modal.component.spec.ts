import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateModalComponent } from './corporate-modal.component';

describe('CorporateModalComponent', () => {
  let component: CorporateModalComponent;
  let fixture: ComponentFixture<CorporateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
