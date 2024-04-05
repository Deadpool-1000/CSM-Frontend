import { RouterModule, Routes } from "@angular/router";
import { HelpdeskOperationsComponent } from "./helpdesk-operations.component";
import { NgModule } from "@angular/core";
import { TicketResolver } from "../tickets/resolver/ticket-resolver.service";

const HELPDESK_OPS_ROUTES: Routes = [
    {
        path: 'close',
        component: HelpdeskOperationsComponent,
        resolve: {
            ticket: TicketResolver
        },
        data: {
            operation: 'close'
        }
    },
    {
        path: 'resolve',
        component: HelpdeskOperationsComponent,
        resolve: {
            ticket: TicketResolver
        },
        data: {
            operation: 'resolve'
        }
    }
]


@NgModule({
    imports: [RouterModule.forChild(HELPDESK_OPS_ROUTES)],
    exports: [RouterModule]
})
export class HelpdeskRoutingModule{}