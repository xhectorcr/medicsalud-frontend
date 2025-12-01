import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Medicshop } from './medicshop';

describe('Medicshop', () => {
  let component: Medicshop;
  let fixture: ComponentFixture<Medicshop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Medicshop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Medicshop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
