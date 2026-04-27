import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ta } from './ta';

describe('Ta', () => {
  let component: Ta;
  let fixture: ComponentFixture<Ta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
