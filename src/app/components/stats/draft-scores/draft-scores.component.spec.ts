import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftScoresComponent } from './draft-scores.component';

describe('DraftScoresComponent', () => {
  let component: DraftScoresComponent;
  let fixture: ComponentFixture<DraftScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftScoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DraftScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
