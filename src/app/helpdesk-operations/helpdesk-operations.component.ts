import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketModel } from '../models/ticket.model';
import { NgForm } from '@angular/forms';
import { HelpdeskOperationService } from './service/helpdesk-operation.service';
import { MessageService } from 'primeng/api';
import { Text } from '../statics/text';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-helpdesk-operations',
  templateUrl: './helpdesk-operations.component.html',
  styleUrl: './helpdesk-operations.component.css',
})
export class HelpdeskOperationsComponent implements OnInit, OnDestroy {
  ticket: TicketModel;
  operation: string;
  isLoading = false;
  operationSubscription: Subscription;
  errorMessage: string;

  constructor(private messageService: MessageService, private router: Router, private activatedRoute: ActivatedRoute, private helpdeskOperationService: HelpdeskOperationService) { }


  ngOnInit(): void {
    const { ticket_id, status, message_from_helpdesk, created_on, title, description } = this.activatedRoute.snapshot.data['ticket']['ticket'];
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

  handleSubmit(messageForm: NgForm) {
    this.isLoading = true;
    const { message_from_helpdesk } = messageForm.value;

    if(messageForm.invalid){
      this.errorMessage = "Please fill all the required fields correctly"
      return;
    }
    
    if (this.operation === 'close') {
      this.operationSubscription = this.helpdeskOperationService.closeTicket(this.ticket.ticket_id, message_from_helpdesk).subscribe(
        (_) => {
          this.router.navigate(['tickets', this.ticket.ticket_id]);
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: Text.SUCCESS,
            detail: Text.TICKET_OPERATION_SUCCESS.replace('{ticketId}', this.ticket.ticket_id).replace('{operation}', this.operation)
          });
        }
      )
    } else if (this.operation === 'resolve') {
      this.operationSubscription = this.helpdeskOperationService.resolveTicket(this.ticket.ticket_id, message_from_helpdesk).subscribe(
        (_) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: Text.SUCCESS,
            detail: Text.TICKET_OPERATION_SUCCESS.replace('{ticketId}', this.ticket.ticket_id).replace('{operation}', this.operation)
          });
          this.router.navigate(['tickets', this.ticket.ticket_id]);
        }
      )
    }
  }


  ngOnDestroy(): void {
    if (this.operationSubscription)
      this.operationSubscription.unsubscribe();
  }

}
