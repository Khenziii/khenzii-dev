import { BaseService } from "@khenzii-dev/server/backend";
import { type User } from "@khenzii-dev/server/auth";
import { compare } from "bcrypt";

export type loginInput = {
    email: string;
    password: string;
};

export class AccountService extends BaseService {
    async login(): Promise<User | null> {
        const input = this.input as loginInput;
        const account = await this.ctx.db.account.findFirst({
            where: {
                email: input.email,
            },
        });
    
        if (!account) return null;

        const passwordValid = await compare(input.password, account.password);
        if (passwordValid) return account;
        
        return null;
    }
}
