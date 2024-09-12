import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TicketDetailModel } from "../../models/ticket.model";
import { ErrorHandlerService } from "../error-handler/error-handler.service";
import { catchError, forkJoin, Observable, of } from "rxjs";
import { FeedbackService } from "../feedback/feedback.service";
import { MessageFromMgrService } from "../message-from-mgr/message-from-mgr.service";
import { map, mergeMap } from "rxjs/operators"
import { AuthService } from "../auth/auth.service";
import { Text } from "../../statics/text";


@Injectable({
    providedIn: "root"
})
export class TicketService {
    constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService, private feedbackService: FeedbackService, private messageFromMgr: MessageFromMgrService, private authService: AuthService) { }

    getAllTickets() {
        return this.http.get(Text.TICKETS_URL).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

    getTicketDetail(ticket_id: string) {
        return this.authService.currentUser.pipe(
            mergeMap(
                (currentUser) => {
                    if (currentUser) {
                        const basicDetails: { [key: string]: Observable<any> } = {
                            ticket: this.http.get<TicketDetailModel>(Text.TICKET_URL.replace('{ticket_id}', ticket_id)),
                        }
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
        return this.http.post(Text.TICKETS_URL, {
            title,
            description,
            d_id: department
        }).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }
}