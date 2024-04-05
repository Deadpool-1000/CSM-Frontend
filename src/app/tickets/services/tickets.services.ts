import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TicketDetailModel } from "../models/ticket.model";
import { ErrorHandlerService } from "../../services/error-handler.service";
import { catchError } from "rxjs";


const BASE_URL = 'http://localhost:5000';
const TICKETS_URL = `${BASE_URL}/tickets`;

@Injectable({
    providedIn: "root"
})
export class TicketService {
    constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService){}
    
    getAllTickets(){
        return this.http.get(TICKETS_URL).pipe(
            catchError(err=>this.errorHandlerService.handleError(err))
        );
    }

    getTicketDetail(ticket_id: string){
        return this.http.get<TicketDetailModel>(`${BASE_URL}/tickets/${ticket_id}`).pipe(
            catchError(err=>this.errorHandlerService.handleError(err))
        );
    }

    raiseNewTicket(title: string, description: string, department: string){
        return this.http.post(TICKETS_URL, {
            title,
            description,
            d_id: department
        }).pipe(
            catchError(err=>this.errorHandlerService.handleError(err))
        );
    }
}