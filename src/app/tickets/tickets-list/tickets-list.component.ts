import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketModel } from '../models/ticket.model';


@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrl: './tickets-list.component.css'
})
export class TicketsListComponent implements OnInit {
  tickets: TicketModel[] = [];
  filteredTickets: TicketModel[] = []
  filterByStatus!: string
  constructor(private activatedRoute: ActivatedRoute){}
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      data=>{
        this.tickets = data['tickets'];
        this.filteredTickets = this.tickets;
      }
    );
    this.activatedRoute.queryParamMap.subscribe(
      queryParams=>{
        const filterByStatus = queryParams.get('status');
        console.log("filter by ---> ",filterByStatus);
        if(filterByStatus && ['closed', 'raised', 'in_progress'].indexOf(filterByStatus) !== -1){
          this.filteredTickets = this.tickets.filter(ticket=>ticket.status === filterByStatus);
        }
      }
    )
  }
}
