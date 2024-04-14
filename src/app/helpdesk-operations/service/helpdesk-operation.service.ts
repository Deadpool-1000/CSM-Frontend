import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Text } from "../../statics/text";


@Injectable()
export class HelpdeskOperationService {
    constructor(private http: HttpClient) { }

    closeTicket(ticket_id: string, message_from_helpdesk: string) {
        return this.http.put(Text.CLOSE_TICKET_URL.replace('{ticket_id}', ticket_id), {
            message_from_helpdesk
        })
    }

    resolveTicket(ticket_id: string, message_from_helpdesk: string) {
        return this.http.put(Text.RESOLVE_TICKET_URL.replace('{ticket_id}', ticket_id), {
            message_from_helpdesk
        });
    }
}