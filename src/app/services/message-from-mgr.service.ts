import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MgrFeedbackModel } from "../models/feedback.model";
import { catchError } from "rxjs";
import { ErrorHandlerService } from "./error-handler.service";
import { Text } from "../statics/text";



@Injectable({
    providedIn: 'root'
})
export class MessageFromMgrService{

    constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService){}

    addMessageFromMgr(ticket_id: string, message_from_manager: string){
        return this.http.put(Text.MESSAGE_URL.replace('{ticket_id}', ticket_id), {
            message_from_manager
        }).pipe(
            catchError(
                err=>this.errorHandlerService.handleError(err)
            )
        )
    }

    getMessageFromMgr(ticket_id: string){
        return this.http.get<MgrFeedbackModel>(Text.MESSAGE_URL.replace('{ticket_id}',ticket_id)).pipe(
            catchError(
                err=>this.errorHandlerService.handleError(err)
            )
        )
    }
}