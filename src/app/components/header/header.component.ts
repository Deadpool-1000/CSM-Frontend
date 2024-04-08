import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';
import { Router } from '@angular/router';
import { Subscription, take, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Text } from '../../statics/text';

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

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService){}

  ngOnInit(): void {
    this.userSubscription = this.authService.isLoggedIn.subscribe(isLoggedIn=>{
      this.isLoggedIn = isLoggedIn;
    });
    this.authSubscription = this.authService.currentUser.subscribe(user=>{
      this.user = user;
    })
  }
  onLogout(){
    this.logoutSubscription = this.authService.logout("Logged out Successfully.").subscribe(
      (done)=>{
        this.messageService.add({
          severity: 'success',
          summary: Text.SUCCESS,
          detail: Text.LOGOUT
        })
        this.router.navigate(['auth', 'login']);
      }
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    if(this.logoutSubscription)
        this.logoutSubscription.unsubscribe();
  }
}
