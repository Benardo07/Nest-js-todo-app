import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        console.log(request.user)
        console.log("this is my admin guard")
        if (!request.user) {
            throw new UnauthorizedException('No user is currently authenticated');
        }

        if (!request.user.admin) {
            throw new UnauthorizedException('Access is restricted to administrators only');
        }

        return true;
    }
}
