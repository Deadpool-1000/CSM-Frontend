import { NgModule } from "@angular/core";
import { NewTicketComponent } from "./new-ticket/new-ticket.component";
import { TicketsListComponent } from "./tickets-list/tickets-list.component";
import { TicketDetailComponent } from "./ticket-detail/ticket-detail.component";
import { TicketItemComponent } from "../utility/ticket-item/ticket-item.component";
import { TicketsRoutingModule } from "./ticket-routing.module";
import { CommonModule } from "@angular/common";
import { TicketService } from "./services/tickets.services";
import {DataViewModule} from 'primeng/dataview'
import {CardModule} from 'primeng/card'
import { UserDetailComponent } from "../utility/user-detail/user-detail.component";
import { MessageComponent } from "../utility/message/message.component";
import { FeedbackService } from "../feedback/feedback.service";
import { MessageFromMgrService } from "../message-from-mgr/message-from-mgr.service";
import { FormsModule } from "@angular/forms";
import { RatingModule } from "primeng/rating";


@NgModule({
    declarations: [
        NewTicketComponent,
        TicketsListComponent,
        TicketDetailComponent,
    ],
    imports: [
        DataViewModule,RatingModule,
        CardModule,
        CommonModule,
        TicketsRoutingModule,
        UserDetailComponent,
        MessageComponent,
        TicketItemComponent,
        FormsModule
    ],
    providers: [TicketService, FeedbackService, MessageFromMgrService]
})
export class TicketsModule{}