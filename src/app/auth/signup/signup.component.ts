import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Text } from '../../statics/text';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnDestroy {
  isLoading = false;
  error: string = '';
  signupSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { }

  handleSignup(signupForm: NgForm) {
    this.isLoading = true;
    const { email, password, 'confirm-password': confirmPassword, 'address-1': address1, 'address-2': address2, city, pincode, 'phone-number': phoneNumber, 'full-name': fullName } = signupForm.value;

    const address = this.prepareAddress(address1, address2, city, pincode);

    //password and confirm-password does not match
    if (password !== confirmPassword) {
      this.error = Text.PASSWORD_MISMATCH;
      signupForm.controls['password'].reset();
      signupForm.controls['confirm-password'].reset();
      this.isLoading = false;
      return;
    }

    this.signupSubscription = this.authService.signup(
      email, password, fullName, phoneNumber, address
    ).subscribe({
        next: (data) => {
          console.log(data)
          this.isLoading = false;
          this.router.navigate(['/auth/login'], {
            queryParams: new HttpParams().set('message', Text.LOGIN_TO_CONTINUE)
          })
        },
        error: error => {
          console.log(error);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: Text.ERROR,
            detail: error
          })
        }
      })
  }

  prepareAddress(address1: string, address2: string, city: string, pincode: string) {
    if (address2)
      return `${address1},${address2},${city},${pincode}`;
    else return `${address1},${city},${pincode}`
  }

  ngOnDestroy(): void {
    if(this.signupSubscription)
      this.signupSubscription.unsubscribe()
  }
}
