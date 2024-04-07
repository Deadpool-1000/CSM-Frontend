import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { TicketResolver } from './tickets/resolver/ticket-resolver.service';
import { isLoginGuard } from './services/guards/isLogin-guard.service';
import { allowedUsers } from './services/guards/role-guard.service';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'tickets',
    canActivate: [isLoginGuard],
    canActivateChild: [isLoginGuard],
    loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule)
  },
  {
    path: 'tickets/:id/feedback',
    canActivate: [allowedUsers('CUSTOMER')],
    loadComponent: () => import('./components/feedback/feedback.component').then(m => m.FeedbackComponent)
  },
  {
    path: 'tickets/:id/operation',
    canActivate: [allowedUsers('HELPDESK')],
    loadChildren: () => import('./helpdesk-operations/helpdesk-operations.module').then(m => m.HelpdeskOperationsModule)
  },
  {
    path: 'tickets/:id/message-from-mgr',
    canActivate: [allowedUsers('MANAGER')],
    loadComponent: () => import('./components/message-from-mgr/message-from-mgr.component').then(m => m.MessageFromMgrComponent),
    resolve: {
      ticket: TicketResolver
    }
  },
  {
    path: 'not-found',
    component: PageNotFoundComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: "**",
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
