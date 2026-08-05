import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // getAllAndOverride يقرأ من الدالة (method) أولاً ثم يرجع للـ controller (class) إن لم تجد شيئاً —
    // getHandler() وحدها كانت تتجاهل @Roles الموضوعة على مستوى الـ controller بالكامل (كما في ReportsController)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { role } = context.switchToHttp().getRequest().user;

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException(
        'ليس لديك الصلاحية للقيام بهذه العملية',
      );
    }

    return true;
  }
}
