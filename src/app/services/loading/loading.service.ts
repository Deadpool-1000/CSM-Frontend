import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


// Used to provide app-wide loading state
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    isLoading = new BehaviorSubject<boolean>(false);
}