import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterByValues, SortByValues, TicketModel } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';


@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrl: './tickets-list.component.css'
})
export class TicketsListComponent implements OnInit {
  tickets: TicketModel[] = [];
  filteredTickets: TicketModel[] = []
  filterByStatus: string;
  currentUser: UserModel | null;
  sortBy: SortByValues;
  filterBy: FilterByValues;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService){}
  
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      data=>{
        this.tickets = data['tickets'];
        this.filteredTickets = this.tickets;
      }
    );

    this.authService.currentUser.subscribe(
      currentUser=>{
        this.currentUser = currentUser;
      }
    )
  }
}
