import { UserService } from "../../services";

export interface GetUserListDesp{
    userService: UserService
}

export async function getUserList(deps: GetUserListDesp){
    return await deps.userService.findAll();
}