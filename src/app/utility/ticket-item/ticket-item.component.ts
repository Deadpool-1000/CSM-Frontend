import { Component, Input } from '@angular/core';
import { TicketModel } from '../../tickets/models/ticket.model';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { timer } from 'rxjs';

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrl: './ticket-item.component.css',
  imports: [RouterLink, NgClass, DatePipe, RouterModule],
  standalone: true
})
export class TicketItemComponent {
  @Input() ticket !: TicketModel;
  constructor(private router: Router){}
  ticketDetail(){
    this.router.navigate(['/tickets/', this.ticket.ticket_id]);
  }
}
