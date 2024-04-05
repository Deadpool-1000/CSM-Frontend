import { RouterModule, Routes } from "@angular/router";
import { TicketsListComponent } from "./tickets-list/tickets-list.component";
import { NewTicketComponent } from "./new-ticket/new-ticket.component";
import { TicketDetailComponent } from "./ticket-detail/ticket-detail.component";
import { NgModule } from "@angular/core";
import { TicketsResolver } from "./resolver/tickets-resolver.service";
import { TicketResolver } from "./resolver/ticket-resolver.service";

const TICKETS_ROUTE: Routes = [
    {
        path: '',
        resolve: {
            tickets: TicketsResolver
        },
        component: TicketsListComponent
    },
    {
        path: 'new',
        component: NewTicketComponent,
    },
    {
        path: ':id',
        resolve:{
            ticket: TicketResolver
        },
        component: TicketDetailComponent
    }
]


@NgModule({
    imports: [RouterModule.forChild(TICKETS_ROUTE)],
    exports: [RouterModule]

})
export class TicketsRoutingModule{}