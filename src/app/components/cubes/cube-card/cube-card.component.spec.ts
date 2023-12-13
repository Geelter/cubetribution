import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubeCardComponent } from './cube-card.component';

describe('CubeCardComponent', () => {
  let component: CubeCardComponent;
  let fixture: ComponentFixture<CubeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CubeCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CubeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
