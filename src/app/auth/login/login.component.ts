import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription, timer } from 'rxjs';
import { Text } from '../../statics/text';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  message: string | null = null;
  loginSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit(): void {
    const message = this.activatedRoute.snapshot.queryParamMap.get('message');
    if (message) {
      this.message = message;
    }
  }

  handleLogin(f: NgForm) {
    const { email, password, role } = f.value;

    this.isLoading = true;
    this.loginSubscription = this.authService.login(
      email,
      password,
      role
    ).subscribe({
      next: (_) => {
        this.messageService.add({
          severity: 'success',
          summary: Text.SUCCESS,
          detail: Text.LOGIN_SUCCESS
        });
        timer(2*1000).subscribe(
          (_)=>{
            this.isLoading = false;
            this.router.navigate(['/tickets']);
          }
        )
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: Text.ERROR,
          detail: error
        });
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    if(this.loginSubscription)
      this.loginSubscription.unsubscribe();
  }
}
