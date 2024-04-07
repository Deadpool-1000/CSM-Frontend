import { ErrorModel } from "../../models/error.model";
import { FeedbackModel } from "../../models/feedback.model";
import { MessageModel } from "../../models/message.model";
import { UserDetailModel } from "../../models/user.model";

export interface TicketModel  {
    created_on: string;
    description: string;
    message_from_helpdesk: MessageModel;
    status: string;
    ticket_id: string;
    title: string;
} 

export interface TicketDetailModel extends TicketModel{
    customer?:UserDetailModel;
    helpdesk_assigned?:UserDetailModel;
    department: DepartmentModel;
}

export interface DepartmentModel {
    dept_id: string;
    dept_name: string;
}

export interface TicketExtraDetails{
    currentUser: UserDetailModel;
    ticket: TicketDetailModel;
    feedback: FeedbackModel | ErrorModel; //handle cases when it does not exist
    messageFromMgr: MessageModel | ErrorModel; //handle cases when it does not exist
}