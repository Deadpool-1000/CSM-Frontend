import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketModel } from '../tickets/models/ticket.model';
import { NgForm } from '@angular/forms';
import { HelpdeskOperationService } from './helpdesk-operation.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-helpdesk-operations',
  templateUrl: './helpdesk-operations.component.html',
  styleUrl: './helpdesk-operations.component.css',
})
export class HelpdeskOperationsComponent implements OnInit {
  ticket !: TicketModel;
  operation !: string;
  isLoading = false;
  
  constructor(private messageService: MessageService ,private router: Router, private activatedRoute: ActivatedRoute, private helpdeskOperationService: HelpdeskOperationService){}

  ngOnInit(): void {
    const {ticket_id, status, message_from_helpdesk, created_on, title, description} = this.activatedRoute.snapshot.data['ticket'];
    this.ticket = {
      ticket_id,
      status,
      description,
      message_from_helpdesk,
      title,
      created_on
    }
    this.operation = this.activatedRoute.snapshot.data['operation'];
  }

  handleSubmit(messageForm: NgForm){
    this.isLoading = true;
    const {message_from_helpdesk} = messageForm.value;

    if(this.operation === 'close'){
      this.helpdeskOperationService.closeTicket(this.ticket.ticket_id, message_from_helpdesk).subscribe(
        (message)=>{
          console.log(message);
          this.router.navigate(['tickets', this.ticket.ticket_id]);
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: `Ticket#${this.ticket.ticket_id} closed successfully.`
          });
        }
      )
    } else if(this.operation === 'resolve'){
      this.helpdeskOperationService.resolveTicket(this.ticket.ticket_id, message_from_helpdesk).subscribe(
        (message)=>{
          console.log(message);
          this.router.navigate(['tickets', this.ticket.ticket_id]);
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: `Ticket#${this.ticket.ticket_id} resolved successfully.`
          });
        }
      )
    }
  }
}
