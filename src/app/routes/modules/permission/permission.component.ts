import { Component } from '@angular/core';
import { catchError, forkJoin } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { User } from 'src/app/models/auth';
import { AllPermission, SideMenu } from 'src/app/models/menu';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
})
export class PermissionComponent {
  users: User[];
  menu: SideMenu[];
  allPermission: AllPermission[];

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    forkJoin([
      this.authService.getAllUser(),
      this.menuService.getAllMenu(),
      this.menuService.getAllPermissions(),
    ]).subscribe((resp) => {
      this.users = resp[0].result;
      this.menu = resp[1].result;
      this.allPermission = resp[2].result;
    });
  }

  change(event: any, user: User, item: SideMenu) {
    if (event.target.checked) {
      this.menuService
        .givePermission(user.user_id, item._id)
        .pipe(
          catchError((err) => {
            this.confirmationService.open({
              title: 'Error',
              icon: {
                color: 'warn',
                name: 'error',
                show: true,
              },
              message:
                err.error?.err?.message ||
                err.error?.error ||
                'something went wrong!',
              dismissible: false,
              actions: {
                confirm: {
                  label: 'Ok!',
                  color: 'warn',
                  show: true,
                },
                cancel: {
                  show: false,
                },
              },
            });

            throw new Error(err);
          })
        )
        .subscribe();
    } else {
      this.menuService
        .deletePermission(user.user_id, item._id)
        .pipe(
          catchError((err) => {
            this.confirmationService.open({
              title: 'Error',
              icon: {
                color: 'warn',
                name: 'error',
                show: true,
              },
              message:
                err.error?.err?.message ||
                err.error?.error ||
                'something went wrong!',
              dismissible: false,
              actions: {
                confirm: {
                  label: 'Ok!',
                  color: 'warn',
                  show: true,
                },
                cancel: {
                  show: false,
                },
              },
            });

            throw new Error(err);
          })
        )
        .subscribe();
    }
  }

  checkUserMenu(user_id: string, menu: string) {
    for (let i = 0; i < this.allPermission.length; i++) {
      if (
        this.allPermission[i].users.includes(user_id) &&
        this.allPermission[i].menu === menu
      ) {
        return true;
      }
    }
    return false;
  }
}
