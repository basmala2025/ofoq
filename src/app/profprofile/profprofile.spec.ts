import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profprofile } from './profprofile';

describe('Profprofile', () => {
  let component: Profprofile;
  let fixture: ComponentFixture<Profprofile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profprofile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profprofile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
