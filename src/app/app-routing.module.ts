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
import { MyInvestmentComponent } from './routes/modules/my-investment/my-investment.component';
import { WebScrapingComponent } from './routes/modules/web-scraping/web-scraping.component';
import { TrainComponent } from './routes/modules/train/train.component';
import { CoachComponent } from './routes/modules/train/chart/coach/coach.component';
import { ChartComponent } from './routes/modules/train/chart/chart.component';
import { AvailabilityComponent } from './routes/modules/train/availability/availability.component';
import { StockComponent } from './routes/modules/stock/stock.component';
import { SearchListComponent } from './routes/modules/stock/search-list/search-list.component';
import { FundDetailsComponent } from './routes/modules/stock/fund-details/fund-details.component';
import { PhotosComponent } from './routes/modules/photos/photos.component';
import { CloudStorageComponent } from './routes/modules/cloud-storage/cloud-storage.component';
import { SalaryComponent } from './routes/modules/salary/salary.component';
import { LoanComponent } from './routes/modules/loan/loan.component';
import { CCTVComponent } from './routes/modules/cctv/cctv.component';
import { VerifyEmailComponent } from './routes/auth/verify-email/verify-email.component';
import { VerifyResetPasswordComponent } from './routes/auth/verify-reset-password/verify-reset-password.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'task' },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'set-reset-password', component: VerifyResetPasswordComponent },
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
      { path: 'my-investment', component: MyInvestmentComponent },
      { path: 'web-scraping', component: WebScrapingComponent },
      { path: 'train', component: TrainComponent },
      { path: 'train/chart', component: ChartComponent },
      { path: 'train/coach', component: CoachComponent },
      { path: 'train/availability', component: AvailabilityComponent },
      { path: 'stock', component: StockComponent },
      { path: 'stock/list', component: SearchListComponent },
      { path: 'stock/fund-details', component: FundDetailsComponent },
      { path: 'photos', component: PhotosComponent },
      { path: 'cloud-storage', component: CloudStorageComponent },
      { path: 'cloud-storage/:folder_id', component: CloudStorageComponent },
      { path: 'salary', component: SalaryComponent },
      { path: 'loan', component: LoanComponent },
      { path: 'cctv', component: CCTVComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
