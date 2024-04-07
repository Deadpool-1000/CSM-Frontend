import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TicketDetailModel } from "../models/ticket.model";
import { ErrorHandlerService } from "../../services/error-handler.service";
import { catchError, forkJoin, Observable, of } from "rxjs";
import { FeedbackService } from "../../services/feedback.service";
import { MessageFromMgrService } from "../../services/message-from-mgr.service";
import { map, mergeMap, tap } from "rxjs/operators"
import { AuthService } from "../../services/auth.service";

const BASE_URL = 'http://localhost:5000';
const TICKETS_URL = `${BASE_URL}/tickets`;

@Injectable({
    providedIn: "root"
})
export class TicketService {
    constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService, private feedbackService: FeedbackService, private messageFromMgr: MessageFromMgrService, private authService: AuthService) { }

    getAllTickets() {
        return this.http.get(TICKETS_URL).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

    getTicketDetail(ticket_id: string) {
        return this.authService.currentUser.pipe(
            mergeMap(
                (currentUser) => {
                    if (currentUser) {
                        const basicDetails: { [key: string]: Observable<any> } = {
                            ticket: this.http.get<TicketDetailModel>(`${BASE_URL}/tickets/${ticket_id}`),
                        }
                        console.log(currentUser)
                        if (currentUser.role === 'CUSTOMER') {
                            basicDetails['feedback'] = this.feedbackService.getFeedback(ticket_id).pipe(catchError(error => of(null)))
                        }
                        else if (currentUser.role === 'HELPDESK') {
                            basicDetails['messageFromMgr'] = this.messageFromMgr.getMessageFromMgr(ticket_id).pipe(catchError(error => of(null)))
                        }
                        else if (currentUser.role === 'MANAGER') {
                            basicDetails['feedback'] = this.feedbackService.getFeedback(ticket_id).pipe(catchError(error => of(null)))
                            basicDetails['messageFromMgr'] = this.messageFromMgr.getMessageFromMgr(ticket_id).pipe(catchError(error => of(null)))
                        }
                        return forkJoin(basicDetails).pipe(
                            map(
                                data => {
                                    data['currentUser'] = currentUser
                                    return data
                                }
                            )
                        )
                    }
                    else {
                        return of({})
                    }
                }
            )
        )
    }

    raiseNewTicket(title: string, description: string, department: string) {
        return this.http.post(TICKETS_URL, {
            title,
            description,
            d_id: department
        }).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }
}