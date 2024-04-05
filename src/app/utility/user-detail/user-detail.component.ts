import { Component, Input, OnInit } from '@angular/core';
import { UserDetailModel } from '../../models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
  standalone: true
})
export class UserDetailComponent {
  @Input() user!: UserDetailModel|undefined;
  @Input() role!:string
}
