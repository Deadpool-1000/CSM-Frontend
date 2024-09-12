import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { TokenInterceptor } from "./token-interceptor.service";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TokenService } from "../token/token.service";

describe('TokenInterceptor (Isolated)', ()=>{
    let client: HttpClient;
    let controller: HttpTestingController;
    let tokenServiceSpy: any;
    let token: string;

    beforeEach(()=>{
        tokenServiceSpy = {
            get token(){ return token}
        };
        
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
                {provide: TokenService, useValue: tokenServiceSpy}
            ]
        });
        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    it('appends token in request when token service has token', ()=>{
        // change the value of token in tokenService Spy
        token = "<example-token>"

        client.get("example.com").subscribe(
            (response)=>{
                expect(response).toBe("hello world!");
            }
        )
        const exampleRequest = controller.expectOne("example.com");
        exampleRequest.flush("hello world!");
        

        const authorizationHeader = exampleRequest.request.headers.get("authorization");
        expect(authorizationHeader).toBeDefined();
        expect(authorizationHeader).toBe(`Bearer ${token}`);
    });

    it('doesnt manipulate headers when token service has no token', ()=>{
        token = "";
        client.get("example.com").subscribe(
            (response)=>{
                expect(response).toBe("Hello world!");
            }
        );

        const exampleRequest = controller.expectOne("example.com");
        exampleRequest.flush("Hello world!");

        const authorizationHeader = exampleRequest.request.headers.get("authorization");
        expect(authorizationHeader).toBeNull();
    });
})