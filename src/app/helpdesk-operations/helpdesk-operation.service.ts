import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

const BASE_URL = 'http://localhost:5000'
const TICKET_URL = `${BASE_URL}/tickets`


@Injectable()
export class HelpdeskOperationService {
    constructor(private http: HttpClient){}

    closeTicket(ticket_id: string, message_from_helpdesk: string){
        return this.http.put(`${TICKET_URL}/${ticket_id}/close`, {
            message_from_helpdesk
        })
    }

    resolveTicket(ticket_id: string, message_from_helpdesk: string){
        return this.http.put(`${TICKET_URL}/${ticket_id}/resolve`, {
            message_from_helpdesk
        });
    }
}