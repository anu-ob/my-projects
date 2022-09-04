import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrHomeComponent } from './cr-home.component';

describe('CrHomeComponent', () => {
  let component: CrHomeComponent;
  let fixture: ComponentFixture<CrHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
