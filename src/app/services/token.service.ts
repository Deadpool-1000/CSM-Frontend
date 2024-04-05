import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class TokenService{
    private _token: string | undefined;

    public set token(token: string){
        this._token = token;
    }

    public get token(): string|undefined{
        return this._token;
    }
}