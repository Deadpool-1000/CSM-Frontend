import { Component, Input, OnInit } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  imports: [NgIf, DatePipe],
  standalone: true
})
export class MessageComponent implements OnInit{
  @Input() title!: string 
  @Input() message!: MessageModel

  ngOnInit(): void {
    console.log(this.message);
  }
}
