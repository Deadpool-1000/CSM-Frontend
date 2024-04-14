import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageFromMgrService } from '../../services/message-from-mgr.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketModel } from '../../models/ticket.model';
import { TicketItemComponent } from '../../utility/ticket-item/ticket-item.component';
import { DatePipe, NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FeedbackModel } from '../../models/feedback.model';
import { RatingModule } from 'primeng/rating';
import { MessageModel } from '../../models/message.model';
import { Text } from '../../statics/text';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-message-from-mgr',
  templateUrl: './message-from-mgr.component.html',
  styleUrl: './message-from-mgr.component.css',
  standalone: true,
  providers: [MessageFromMgrService],
  imports: [FormsModule, TicketItemComponent, NgIf, RatingModule, DatePipe]
})
export class MessageFromMgrComponent implements OnInit, OnDestroy {
  ticket!: TicketModel;
  isLoading = false;
  feedback: FeedbackModel;
  messageFromMgr: MessageModel;
  messageSubscription: Subscription;

  constructor(private messageFromMgrService: MessageFromMgrService, private activatedRoute: ActivatedRoute, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      data => {
        const ticketData = data['ticket'];
        const { ticket } = ticketData;
        const { created_on, message_from_helpdesk, description, status, ticket_id, title } = ticket;
        this.ticket = {
          created_on,
          message_from_helpdesk,
          description,
          status,
          ticket_id,
          title
        }
        this.feedback = ticketData.feedback;
        if (ticketData.messageFromMgr)
          this.messageFromMgr = ticketData.messageFromMgr;
        else {
          this.messageFromMgr = {
            created_at: '',
            message: ''
          }
        }

      }
    )
  }


  handleSubmit(messageFromManagerForm: NgForm) {
    this.isLoading = true;
    const { message_from_manager } = messageFromManagerForm.value;
    this.messageSubscription = this.messageFromMgrService.addMessageFromMgr(this.ticket.ticket_id, message_from_manager).subscribe({
      error: error => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: Text.ERROR,
          detail: error
        });
      },
      complete: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: Text.SUCCESS,
          detail: Text.MESSAGE_FROM_MGR + this.ticket.ticket_id
        });
        this.router.navigate(['/tickets', this.ticket.ticket_id]);
      }
    })
  }

  
  ngOnDestroy(): void {
    if(this.messageSubscription)
      this.messageSubscription.unsubscribe();
  }

}
