import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  message: string | null = null
  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private messageService: MessageService){}

  ngOnInit(): void {
    const message = this.activatedRoute.snapshot.queryParamMap.get('message');
    if(message){
      this.message = message;
    }
  }

  handleLogin(f: NgForm){
    const {email, password, role} = f.value;

    this.isLoading = true;
    this.authService.login(
      email, 
      password, 
      role
    ).subscribe({
        next:data=>{
          this.isLoading = false;
          timer(10).subscribe();
        },
        error: error=>{
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error
          });
          this.isLoading = false;
        },
        complete: ()=>{
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Log in successfull'
          });
          this.router.navigate(['tickets']);
        }
  });
  }
}
