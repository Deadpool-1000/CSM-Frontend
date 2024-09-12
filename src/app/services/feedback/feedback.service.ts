import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { FeedbackModel } from "../../models/feedback.model";
import { ErrorHandlerService } from "../error-handler/error-handler.service";
import { catchError } from "rxjs";
import { Text } from "../../statics/text";


@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    constructor(private http: HttpClient, private router: Router, private errorHandlerService: ErrorHandlerService) { }

    registerFeedback(ticket_id: string, stars: number, description: string) {
        return this.http.put(Text.FEEDBACK_URL.replace('{ticket_id}', ticket_id), {
            stars,
            description
        }).pipe(
            catchError(
                err => this.errorHandlerService.handleError(err)
            )
        );
    }

    getFeedback(ticket_id: string | null) {
        return this.http.get<FeedbackModel>(`${Text.TICKETS_URL}/${ticket_id}/feedback`).pipe(
            catchError(
                err => this.errorHandlerService.handleError(err)
            )
        );
    }
}