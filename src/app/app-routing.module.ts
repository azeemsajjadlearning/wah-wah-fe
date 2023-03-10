import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurd } from './auth.guard';
import { LayoutComponent } from './common/layout/layout.component';
import { ResetPasswordComponent } from './routes/auth/reset-password/reset-password.component';
import { SignInComponent } from './routes/auth/signin/signin.component';
import { SignUpComponent } from './routes/auth/signup/signup.component';
import { DashboardComponent } from './routes/modules/dashboard/dashboard.component';
import { IMDbComponent } from './routes/modules/imdb/imdb.component';
import { MovieComponent } from './routes/modules/imdb/movie/movie.component';
import { PersonComponent } from './routes/modules/imdb/person/person.component';
import { SearchResultsComponent } from './routes/modules/imdb/search-results/search-results.component';
import { TvComponent } from './routes/modules/imdb/tv/tv.component';
import { BrandsComponent } from './routes/modules/mobile/brands/brands.component';
import { MobileDetailComponent } from './routes/modules/mobile/detail/detail.component';
import { MobileComponent } from './routes/modules/mobile/mobile.component';
import { PermissionComponent } from './routes/modules/permission/permission.component';
import { ChapterComponent } from './routes/modules/quran/chapter/chapter.component';
import { QuranComponent } from './routes/modules/quran/quran.component';
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
      { path: 'imdb', component: IMDbComponent },
      {
        path: 'imdb/search-results',
        component: SearchResultsComponent,
      },
      { path: 'imdb/movie/:id', component: MovieComponent },
      { path: 'imdb/tv/:id', component: TvComponent },
      { path: 'imdb/person/:id', component: PersonComponent },
      { path: 'mobile', component: MobileComponent },
      { path: 'mobile/device', component: MobileDetailComponent },
      { path: 'mobile/:brand', component: BrandsComponent },
      { path: 'quran', component: QuranComponent },
      { path: 'quran/:chapter_id', component: ChapterComponent },
      { path: 'permission', component: PermissionComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
