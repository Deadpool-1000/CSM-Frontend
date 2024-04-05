import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { FeedbackModel } from "../models/feedback.model";
import { ErrorHandlerService } from "../services/error-handler.service";
import { catchError } from "rxjs";


const BASE_URL = 'http://localhost:5000';
const TICKETS_URL = `${BASE_URL}/tickets`


@Injectable()
export class FeedbackService {
    constructor(private http: HttpClient, private router: Router, private errorHandlerService: ErrorHandlerService){}

    registerFeedback(ticket_id: string | null, stars: number, description: string){
        return this.http.put(`${TICKETS_URL}/${ticket_id}/feedback`, {
            stars,
            description
        }).pipe(catchError(err=>this.errorHandlerService.handleError(err)));
    }

    getFeedback(ticket_id: string| null){
        return this.http.get<FeedbackModel>(`${TICKETS_URL}/${ticket_id}/feedback`).pipe(catchError(err=>this.errorHandlerService.handleError(err)));
    }
}