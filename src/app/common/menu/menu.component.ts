import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'src/app/models/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Output() navbtn = new EventEmitter<any>();

  navigation: MenuItem[] = [
    {
      id: 'dashboards',
      title: 'Dashboard',
      type: 'basic',
      icon: 'monitoring',
      link: 'dashboard',
    },
    {
      id: 'task',
      title: 'Task',
      type: 'basic',
      icon: 'task',
      link: 'task',
    },
    {
      id: 'imdb',
      title: 'IMDb',
      type: 'basic',
      icon: 'movie',
      link: 'imdb',
    },
    {
      id: 'mobile',
      title: 'Mobile Phone',
      type: 'basic',
      icon: 'phone_iphone',
      link: 'mobile',
    },
    {
      id: 'quran',
      title: 'Quran',
      type: 'basic',
      icon: 'menu_book',
      link: 'quran',
    },
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navigation = this.navigation.map((ele: MenuItem) => {
          if (ele.link === event.url.substring(1)) ele.active = true;
          else ele.active = false;
          return ele;
        });
      }
    });
  }

  route() {
    this.navbtn.emit();
  }
}
