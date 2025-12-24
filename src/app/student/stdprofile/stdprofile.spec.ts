import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stdprofile } from './stdprofile';

describe('Stdprofile', () => {
  let component: Stdprofile;
  let fixture: ComponentFixture<Stdprofile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stdprofile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stdprofile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
