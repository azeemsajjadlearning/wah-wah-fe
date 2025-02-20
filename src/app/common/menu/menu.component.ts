import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'src/app/models/menu';
import { MenuService } from 'src/app/services/menu.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: false
})
export class MenuComponent {
  @Output() navbtn = new EventEmitter<any>();

  navigation: MenuItem[];

  constructor(private router: Router, private menuService: MenuService) {
    this.menuService.getPermission().subscribe((res) => {
      this.navigation = res.result;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navigation = this.navigation?.map((ele: MenuItem) => {
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
