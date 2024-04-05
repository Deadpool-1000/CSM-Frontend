import { NgModule } from "@angular/core";
import { HelpdeskRoutingModule } from "./helpdesk-operations-routing.module";
import { TicketItemComponent } from "../utility/ticket-item/ticket-item.component";
import { HelpdeskOperationsComponent } from "./helpdesk-operations.component";
import { FormsModule } from "@angular/forms";
import { HelpdeskOperationService } from "./helpdesk-operation.service";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations:[
        HelpdeskOperationsComponent
    ],
    imports: [TicketItemComponent, HelpdeskRoutingModule, FormsModule, CommonModule],
    providers: [HelpdeskOperationService]
})
export class HelpdeskOperationsModule{}