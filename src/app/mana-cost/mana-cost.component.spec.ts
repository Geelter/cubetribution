import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManaCostComponent } from './mana-cost.component';

describe('ManaCostComponent', () => {
  let component: ManaCostComponent;
  let fixture: ComponentFixture<ManaCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManaCostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManaCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
