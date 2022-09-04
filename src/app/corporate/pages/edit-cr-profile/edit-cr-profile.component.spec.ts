import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCrProfileComponent } from './edit-cr-profile.component';

describe('EditCrProfileComponent', () => {
  let component: EditCrProfileComponent;
  let fixture: ComponentFixture<EditCrProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCrProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCrProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
