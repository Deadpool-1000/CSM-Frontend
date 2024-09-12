import { ComponentFixture, TestBed } from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HelpdeskOperationService } from "./helpdesk-operation.service";
import { Text } from "../../statics/text";


describe('HelpdeskOperationService', ()=>{
    let helpdeskOperationService: HelpdeskOperationService;
    let controller: HttpTestingController;

    beforeEach(
        () => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [HelpdeskOperationService]
            });

            helpdeskOperationService = TestBed.inject(HelpdeskOperationService);
            controller = TestBed.inject(HttpTestingController);
        }
    )

    it('sends close ticket request', ()=>{
        const ticketId = "TKT1234";
        let response:object | undefined;
        const testResponse = {
            status: "success"
        }

        helpdeskOperationService.closeTicket(ticketId, "Test message").subscribe(
            (resp)=>{
                response = resp;
            }
        )

        const request = controller.expectOne((Text.CLOSE_TICKET_URL.replace('{ticket_id}', ticketId)));
        request.flush(testResponse);
        controller.verify();

        expect(response).toEqual(testResponse)
    });

    it('sends resolve ticket request', ()=>{
        const ticketId = "TKT1234";
        let response:object | undefined;
        const testResponse = {
            status: "success"
        }

        helpdeskOperationService.resolveTicket(ticketId, "Test message").subscribe(
            (resp)=>{
                response = resp;
            }
        )

        const request = controller.expectOne((Text.RESOLVE_TICKET_URL.replace('{ticket_id}', ticketId)));
        request.flush(testResponse);
        controller.verify();

        expect(response).toEqual(testResponse)
    });
});