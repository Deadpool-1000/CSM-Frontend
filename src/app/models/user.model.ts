export interface UserModel  {
    full_name: string;
    phn_num: string;
    role: string;
    email: string;
    address: string;
}

export interface CustomerModel extends UserModel {
    c_id: string;
}


export interface EmployeeModel extends UserModel{
    e_id: string;
    dept_name: string;
}

export interface UserDetailModel {
    email: string;
    phn_num: string;
    full_name: string
}