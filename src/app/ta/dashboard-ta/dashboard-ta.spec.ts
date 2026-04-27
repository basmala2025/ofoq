import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTa } from './dashboard-ta';

describe('DashboardTa', () => {
  let component: DashboardTa;
  let fixture: ComponentFixture<DashboardTa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
