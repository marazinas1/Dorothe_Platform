# Route rules

## Admin routing

- Admin and sign-in live under `/admin` (`admin.tsx` layout, `admin._authenticated.tsx` as the only access gate), never under `/$locale`; why: the admin interface language is a per-user preference, and invite/recovery links need one fixed address (`/admin/set-password`).
