import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationGridComponent } from './donation-grid.component';

describe('DonationGridComponent', () => {
  let component: DonationGridComponent;
  let fixture: ComponentFixture<DonationGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DonationGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
