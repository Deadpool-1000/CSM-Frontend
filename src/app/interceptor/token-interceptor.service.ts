import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { TokenService } from "../services/token.service";
import { Injectable } from "@angular/core";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenService.token;
        if(token){
            const modifiedRequest = req.clone({
                withCredentials: true,
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            })
            return next.handle(modifiedRequest);
        }
        return next.handle(req);
    }
}