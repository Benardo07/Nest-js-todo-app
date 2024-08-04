import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        if (!request.currentUser) {
            throw new UnauthorizedException('No user is currently authenticated');
        }

        if (!request.currentUser.admin) {
            throw new UnauthorizedException('Access is restricted to administrators only');
        }

        return true;
    }
}
