import { NgModule } from "@angular/core";
import { NewTicketComponent } from "./new-ticket/new-ticket.component";
import { TicketsListComponent } from "./tickets-list/tickets-list.component";
import { TicketDetailComponent } from "./ticket-detail/ticket-detail.component";
import { TicketItemComponent } from "../utility/ticket-item/ticket-item.component";
import { TicketsRoutingModule } from "./ticket-routing.module";
import { CommonModule } from "@angular/common";
import { TicketService } from "../services/tickets/tickets.services";
import {DataViewModule} from 'primeng/dataview'
import {CardModule} from 'primeng/card'
import { UserDetailComponent } from "../utility/user-detail/user-detail.component";
import { MessageComponent } from "../utility/message/message.component";
import { FeedbackService } from "../services/feedback/feedback.service";
import { MessageFromMgrService } from "../services/message-from-mgr/message-from-mgr.service";
import { FormsModule } from "@angular/forms";
import { RatingModule } from "primeng/rating";
import { OrderByPipe } from "./pipes/order-by.pipe";
import { FilterByPipe } from "./pipes/filter-by-pipe";
import { TabViewModule } from 'primeng/tabview';


@NgModule({
    declarations: [
        NewTicketComponent,
        TicketsListComponent,
        TicketDetailComponent,
        OrderByPipe, 
        FilterByPipe,
    ],
    imports: [
        DataViewModule,RatingModule,
        CardModule,
        CommonModule,
        TicketsRoutingModule,
        UserDetailComponent,
        MessageComponent,
        TicketItemComponent,
        FormsModule,
        TabViewModule
    ],
    providers: [TicketService, FeedbackService, MessageFromMgrService]
})
export class TicketsModule{}