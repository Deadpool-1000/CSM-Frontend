import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TicketService } from '../../services/tickets.services';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Text } from '../../statics/text';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css'
})
export class NewTicketComponent implements OnDestroy {
  isLoading = false;
  newTicketSubscription: Subscription;

  constructor(private ticketService: TicketService, private messageService: MessageService, private router: Router){}

  handleSubmit(issueForm: NgForm){
    this.isLoading = true;
    const {title, description, department} = (issueForm.value);
    this.newTicketSubscription = this.ticketService.raiseNewTicket(title, description, department).subscribe({
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: Text.ERROR,
          detail: error
        });
      },
      complete: ()=>{
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: Text.SUCCESS,
          detail: Text.NEW_TICKET
        })
        this.router.navigate(['/tickets']);
      }
    })
  }

  ngOnDestroy(): void {
    if(this.newTicketSubscription)
      this.newTicketSubscription.unsubscribe();
  }
}
