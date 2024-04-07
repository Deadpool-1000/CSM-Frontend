import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MgrFeedbackModel } from "../models/feedback.model";
import { catchError } from "rxjs";
import { ErrorHandlerService } from "./error-handler.service";


const BASE_URL = 'http://localhost:5000';
const TICKETS_URL = `${BASE_URL}/tickets`


@Injectable()
export class MessageFromMgrService{

    constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService){}

    addMessageFromMgr(ticket_id: string, message_from_manager: string){
        return this.http.put(`${TICKETS_URL}/${ticket_id}/message`, {
            message_from_manager
        }).pipe(
            catchError(
                err=>this.errorHandlerService.handleError(err)
            )
        )
    }

    getMessageFromMgr(ticket_id: string){
        return this.http.get<MgrFeedbackModel>(`${BASE_URL}/tickets/${ticket_id}/message`).pipe(
            catchError(
                err=>this.errorHandlerService.handleError(err)
            )
        )
    }
}