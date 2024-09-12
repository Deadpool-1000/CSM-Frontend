import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { ErrorModel } from "../../models/error.model";


@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {
    constructor(private router: Router){}

    handleError(errorResponse: HttpErrorResponse){
        const errorData: ErrorModel = errorResponse.error;
        const errorCode = +errorData.code;

        // Handle all error response from api and provides user friendly messages
        switch(errorCode){
            case 400:
                return throwError(errorData.message);
            case 401:
                return throwError(errorData.message);
            case 403:
                return throwError(errorData.message);
            case 404:
                return throwError(errorData.message);
            case 409:
                return throwError('Email already in Use.');
            case 422:
                return throwError('Please ensure you are sending the data in correct format.');
            case 500:
                return throwError(errorData.message);
            default:
                console.log("Why here")
                return throwError('Crazy things Happening');
        }
    }    
}