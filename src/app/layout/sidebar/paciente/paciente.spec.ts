import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paciente } from './paciente';

describe('Paciente', () => {
  let component: Paciente;
  let fixture: ComponentFixture<Paciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paciente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paciente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
