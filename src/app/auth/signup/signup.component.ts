import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
  isLoading = false;
  error: string = ''
  constructor(private authService: AuthService, private router: Router, private messageService: MessageService){}

  ngOnInit(): void {
  }

  handleSignup(signupForm: NgForm){
    console.log(signupForm)
    this.isLoading = true;
    const {email, password, 'confirm-password':confirmPassword, 'address-1': address1, 'address-2': address2, city, pincode, 'phone-number': phoneNumber, 'full-name': fullName } = signupForm.value;
    
    const address = this.prepareAddress(address1, address2, city, pincode);
    
    //password and confirm-password does not match
    if(password !== confirmPassword){
      this.error = 'Password and Confirm Password do not match.';
      signupForm.controls['password'].reset();
      signupForm.controls['confirm-password'].reset();
      this.isLoading = false;
      return;
    }

    this.authService.signup(
      email, password,fullName, phoneNumber, address
    )
    .subscribe({
      next:(data)=>{
        console.log(data)
        this.isLoading = false;
        this.router.navigate(['/auth/login'], {
          queryParams: new HttpParams().set('message', 'Please Login to continue')
        })
      },
      error: error=>{
        console.log(error);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        })
      }
    })
  }

  prepareAddress(address1: string, address2: string, city: string, pincode: string){
    return `${address1},${address2},${city},${pincode}`;
  }
}
