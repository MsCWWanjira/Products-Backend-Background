export interface IUser {
    UserId: string;
    UserName: string;
    Email: string;
    Password: string;
    IsDeleted: number;
    IsEmailSent: number;
}
export interface IPayload {
    Sub: string;
    UserName: string;
}