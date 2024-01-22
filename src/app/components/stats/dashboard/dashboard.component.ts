import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";
import {TableModule} from "primeng/table";
import {SupabaseDatabaseService} from "../../../services/supabase/supabase-database.service";
import {from, take} from "rxjs";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, DividerModule, TableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly databaseService = inject(SupabaseDatabaseService);

  currentDate = new Date();

  playerScores = [
    {
      rank: 1,
      player: 'Michał Kowalczyk',
      points: 7,
      wld: '2-0-1',
      omw: '63,0%'
    },
    {
      rank: 2,
      player: 'Bartek',
      points: 6,
      wld: '2-1-0',
      omw: '51,9%'
    },
    {
      rank: 3,
      player: 'Burgund',
      points: 6,
      wld: '2-1-0',
      omw: '48,1%'
    },
    {
      rank: 4,
      player: 'Krystian',
      points: 5,
      wld: '1-0-2',
      omw: '48,1%'
    },
    {
      rank: 5,
      player: 'Dredżyk',
      points: 4,
      wld: '1-1-1',
      omw: '44,4%'
    },
    {
      rank: 6,
      player: 'Pieniążek',
      points: 3,
      wld: '1-2-0',
      omw: '55,6%'
    },
    {
      rank: 7,
      player: 'Grzesiek',
      points: 1,
      wld: '0-2-1',
      omw: '55,6%'
    },
    {
      rank: 8,
      player: 'Mati',
      points: 1,
      wld: '0-2-1',
      omw: '44,4%'
    }
  ];
  constructor() {
    from(this.databaseService.fetchDashboardData()).pipe(
      take(1),
    ).subscribe(value => {
      console.log('Dashboard Data');
      console.log(value);
    })
  }
}
