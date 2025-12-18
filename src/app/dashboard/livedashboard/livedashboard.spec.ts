import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Livedashboard } from './livedashboard';

describe('Livedashboard', () => {
  let component: Livedashboard;
  let fixture: ComponentFixture<Livedashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Livedashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Livedashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
