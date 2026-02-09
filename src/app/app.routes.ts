import { Routes } from '@angular/router';
import { DashBoard } from '../dashBoard/dash-board/dash-board';
import { CreatePage } from '../createPage/create-page/create-page';
import { Review } from '../review/review/review';
import { HistoryPage } from '../history/history-page/history-page';
import { AboutUs } from "../aboutUs/about-us/about-us";
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { SignInPage } from '../signIn/sign-in-page/sign-in-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'home', component: DashBoard },
      { path: 'create', component: CreatePage },
      { path: 'reviews', component: Review },
      { path: 'history', component: HistoryPage },
      { path: 'about-us', component: AboutUs },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'sign-in', component: SignInPage }
    ]
  }
];
