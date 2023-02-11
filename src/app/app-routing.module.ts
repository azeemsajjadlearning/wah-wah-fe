import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurd } from './auth.guard';
import { LayoutComponent } from './common/layout/layout.component';
import { ResetPasswordComponent } from './routes/auth/reset-password/reset-password.component';
import { SignInComponent } from './routes/auth/signin/signin.component';
import { SignUpComponent } from './routes/auth/signup/signup.component';
import { DashboardComponent } from './routes/modules/dashboard/dashboard.component';
import { TaskComponent } from './routes/modules/task/task.component';
import { ProfileComponent } from './routes/profile/profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGaurd],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'task', component: TaskComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
