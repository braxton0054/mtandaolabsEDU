/**
 * Multi-tenant context stub for Phase 1.
 *
 * Phase 2+ will resolve the active tenant from subdomain / header / JWT claim.
 * For Phase 1, this module just exists to prove the architecture can carry a
 * tenant id through the request pipeline without leaking it across tenants.
 */
export interface TenantContext {
  tenantId: string | null;
}

export const NO_TENANT: TenantContext = { tenantId: null };

export function resolveTenant(_req: Request): TenantContext {
  // Intentionally a no-op for Phase 1. Schools/tenants are not implemented yet.
  return NO_TENANT;
}