import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { LoadingService } from './services/loading/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit , OnDestroy {
  loadingServiceSubscription: Subscription;
  isLoading: boolean;
  constructor(private authService: AuthService, private loadingService: LoadingService){}

  ngOnInit(): void {
    this.loadingServiceSubscription = this.loadingService.isLoading.subscribe(
      isLoading=>{
        this.isLoading = isLoading;
      } 
    )
    // Auto login from session storage
    this.authService.autoLogin();

  }

  ngOnDestroy(): void {
    if(this.authService) this.authService?.clearExpirationTimer();
    if(this.loadingService) this.loadingServiceSubscription?.unsubscribe();
  }
}
