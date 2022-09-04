import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsListingComponent } from './students-listing.component';

describe('StudentsListingComponent', () => {
  let component: StudentsListingComponent;
  let fixture: ComponentFixture<StudentsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
