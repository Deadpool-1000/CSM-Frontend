import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TicketService } from '../services/tickets.services';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css'
})
export class NewTicketComponent {
  isLoading = false;

  constructor(private ticketService: TicketService, private messageService: MessageService, private router: Router){}

  handleSubmit(issueForm: NgForm){
    this.isLoading = true;
    const {title, description, department} = (issueForm.value);
    this.ticketService.raiseNewTicket(title, description, department).subscribe({
      next: data=>{
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: "New Ticket raised successfully."
        })
        this.router.navigate(['/tickets']);
      },
      error: error=>{
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
