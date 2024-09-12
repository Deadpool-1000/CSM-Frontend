import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserModel } from '../../models/user.model';
import { Router } from '@angular/router';
import { Subscription, take, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Text } from '../../statics/text';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  user: UserModel|null = null;
  userSubscription: Subscription;
  authSubscription: Subscription;
  logoutSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService, private loadingService: LoadingService){}

  ngOnInit(): void {
    this.userSubscription = this.authService.isLoggedIn.subscribe(isLoggedIn=>{
      this.isLoggedIn = isLoggedIn;
    });
    this.authSubscription = this.authService.currentUser.subscribe(user=>{
      this.user = user;
    })
  }
  onLogout(){
    this.loadingService.isLoading.next(true);
    this.logoutSubscription = this.authService.logout(Text.LOGOUT).subscribe({
      error: (error)=>{
        this.messageService.add({
          severity: 'error',
          summary: Text.ERROR,
          detail: error.message
        });
        this.router.navigate(['about']);
      },
      complete: ()=>{
        this.router.navigate(['auth', 'login']);
        this.loadingService.isLoading.next(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    if(this.logoutSubscription)
        this.logoutSubscription.unsubscribe();
  }
}
