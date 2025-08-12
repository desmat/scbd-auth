export interface AuthUser {
    email          : string,
    government?    : string,
    isAuthenticated: boolean,
    isEmailVerified?: boolean,
    name           : string,
    roles?         : string[],
    userGroups?    : string[],
    userID         : number
}  