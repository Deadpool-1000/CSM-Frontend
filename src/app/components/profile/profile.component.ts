import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Text } from '../../statics/text';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule, TitleCasePipe]
})
export class ProfileComponent implements OnInit {
  currentUser: UserModel|null;
  UserSubscription: Subscription;
  edit: boolean=false;
  full_name:string;
  email: string;
  phn_num:string;
  address1:string;
  address2:string;
  city: string;
  pincode: string;
  isLoading=false;
  profileSubscription: Subscription;

  constructor(private authService: AuthService, private messageService: MessageService){}

  ngOnInit(): void {
    this.UserSubscription = this.authService.currentUser.subscribe(
      (currentUser)=>{
        this.currentUser = currentUser;
        if(currentUser){
          this.email = currentUser.email;
          this.full_name = currentUser.full_name;
          this.phn_num = currentUser.phn_num;
          const address = currentUser.address;
          const [address1, address2, city, pincode] = address.split(',');
          this.address1 = address1;
          this.address2 = address2;
          this.city = city;
          this.pincode = pincode;
        }
        
      }
    )
  }

  onSaveProfile(profileForm: NgForm){
    if(this.currentUser){
      this.isLoading = true;
      const {fullName, email, phnNum, add1, add2, city, pincode} = profileForm.value;
      const fullAddress = this.prepareAddress(add1, add2, city, pincode);
      const role = this.currentUser.role;
      const c_id = this.currentUser.c_id;
      this.profileSubscription = this.authService.putProfile(fullName, phnNum, fullAddress, email, role, c_id)
      .subscribe({
        error: (error)=>{
          this.messageService.add({
            severity: 'error',
            summary: Text.ERROR,
            detail: error
          })
        },
        complete: ()=>{
          this.authService.currentUser.next({
            full_name:fullName,
            phn_num:phnNum, 
            address: fullAddress, 
            email, 
            role: role,
            c_id:c_id
          })
          this.messageService.add({
            severity: 'success',
            summary: Text.SUCCESS,
            detail: Text.PROFILE_UPDATE_SUCCESS
          })
          this.edit = false;
        }
      })
    }
    
  }

  prepareAddress(address1: string, address2: string, city: string, pincode: string) {
    if (address2)
      return `${address1},${address2},${city},${pincode}`;
    else return `${address1},${city},${pincode}`
  }
}
