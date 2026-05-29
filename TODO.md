# TODO - Phase B (Admin Hardening)

- [x] Create/adjust centralized admin CSRF header attachment in `src/admin/services/api.js` (token sourced from AuthContext/session).

- [x] Standardize backend CSRF rejection JSON to exact `{success:false,message:"Invalid CSRF token",errors:[]}` for state-changing requests.

- [x] Harden admin session cookies: Secure when HTTPS, idle timeout, consistent JSON errors.
- [x] Regenerate session id on admin login.
- [x] Upgrade/verify RBAC: ensure all protected endpoints enforce permission checks server-side (403 JSON).
- [x] Harden file upload: MIME inspection, extension whitelist, randomized filenames, block executable uploads, safe upload dirs, consistent JSON.
- [ ] Standardize admin API responses success/error shape while keeping backward compatibility for existing frontend parsing.
- [ ] Validate active/inactive sync on public render filtering (no layout collapse) and stabilize responsive/theme consistency (minimal CSS patches).
- [ ] Final validation: list modified files, remaining risks, endpoints requiring manual review.

