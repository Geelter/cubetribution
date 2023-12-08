import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MenuItem, PrimeNGConfig} from "primeng/api";
import {MenubarModule} from "primeng/menubar";
import {ThemeToggleComponent} from "./theme-toggle/theme-toggle.component";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenubarModule, ThemeToggleComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  primengConfig = inject(PrimeNGConfig);

  title = 'cubetribution';

  menuItems: MenuItem[];

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  constructor() {
    this.menuItems = [
      {
        label: 'Browse',
        routerLink: '/browse'
      },
      {
        label: 'Cubes',
        routerLink: '/cubes'
      },
      {
        label: 'Collections',
        routerLink: '/collections'
      }
    ];
  }
}
