import { Component, OnInit } from '@angular/core';
import { MessageFromMgrService } from '../../services/message-from-mgr.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketModel } from '../../tickets/models/ticket.model';
import { TicketItemComponent } from '../../utility/ticket-item/ticket-item.component';
import { NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-message-from-mgr',
  templateUrl: './message-from-mgr.component.html',
  styleUrl: './message-from-mgr.component.css',
  standalone: true,
  providers: [MessageFromMgrService],
  imports: [FormsModule, TicketItemComponent, NgIf]
})
export class MessageFromMgrComponent implements OnInit {
  ticket!: TicketModel;
  isLoading = false;

  constructor(private messageFromMgrService: MessageFromMgrService, private activatedRoute: ActivatedRoute, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      data => {
        const ticket = data['ticket'];
        const { created_on, message_from_helpdesk, description, status, ticket_id, title } = ticket;
        this.ticket = {
          created_on,
          message_from_helpdesk,
          description,
          status,
          ticket_id,
          title
        }

      }
    )
  }


  handleSubmit(messageFromManagerForm: NgForm) {
    this.isLoading = true;
    const { message_from_manager } = messageFromManagerForm.value;
    this.messageFromMgrService.addMessageFromMgr(this.ticket.ticket_id, message_from_manager).subscribe({
      next: data => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Added note to helpdesk for ticket#' + this.ticket.ticket_id
        });
        this.router.navigate(['/tickets']);
      },
      error: error => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    })
  }

}
