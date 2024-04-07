import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  user: UserModel|null = null
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(isLoggedIn=>{
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.currentUser.subscribe(user=>{
      this.user = user;
    })
  }
  onLogout(){
    this.authService.logout("Logged out Successfully.");
  }

}
