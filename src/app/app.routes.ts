import { Routes } from '@angular/router';
import { DashBoard } from '../dashBoard/dash-board/dash-board';
import { CreatePage } from '../createPage/create-page/create-page';
import { Review } from '../review/review/review';
import { HistoryPage } from '../history/history-page/history-page';
import { AboutUs } from "../aboutUs/about-us/about-us";
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: DashBoard },
  { path: 'create', component: CreatePage },
  { path: 'reviews', component: Review },
  { path: 'history', component: HistoryPage },
  { path: 'about-us', component: AboutUs }

];