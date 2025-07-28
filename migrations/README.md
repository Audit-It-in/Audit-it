# Database Migrations

This directory contains SQL migration scripts for the Audit-it CA Platform database.

## Naming Convention

Migration files follow a sequential naming pattern: `XXX-descriptive-name-YYYY-MM-DD.sql`

- **XXX**: Three-digit sequential number (001, 002, 003, etc.)
- **descriptive-name**: Brief description of what the migration does
- **YYYY-MM-DD**: Date when the migration was created
- **.sql**: File extension

Example: `001-base.sql`, `002-location-management-simple-2025-01-15.sql`

## Migration Files (In Execution Order)

### Core Schema

- `001-base.sql` - Initial database schema and tables
- `002-location-management-simple-2025-01-15.sql` - Location data tables (states, districts)
- `003-profile-completion-tracking-2025-01-15.sql` - Profile completion tracking
- `004-profile-location-fields-2025-01-15.sql` - Added foreign key fields to profiles

### Feature Migrations

- `005-setup-certificate-storage-2025-01-15.sql` - Certificate storage for CA verification
- `006-normalize-schema-2025-01-16.sql` - Database normalization (languages table, removed redundant columns)
- `007-profile-picture-storage-2025-07-13.sql` - Profile picture storage setup
- `008-specializations-normalization-2025-01-16.sql` - **LATEST** Specializations normalization (categories and specializations tables)

## Running Migrations

### Latest Migration: Schema Normalization

To apply the schema normalization migration:

```sql
-- Run this in your Supabase SQL Editor
\i src/migrations/006-normalize-schema-2025-01-16.sql
```

**What this migration does:**

1. ✅ Creates a new `languages` table with 13 common Indian languages
2. ✅ Adds `language_ids` column to profiles table
3. ✅ Migrates existing language data from text array to ID references
4. ✅ Removes redundant `city` and `state` columns (replaced by foreign keys)
5. ✅ Adds helpful database views for easy querying
6. ✅ Sets up proper indexing and RLS policies

**Safety features:**

- Migration is idempotent (safe to run multiple times)
- Old `languages` column is deprecated but not dropped (kept for rollback)
- Data migration preserves all existing language selections
- Foreign key constraints prevent data corruption

### Required Frontend Updates

After running the migration, ensure you:

1. ✅ Update components to use `useLanguageMap()` hook
2. ✅ Replace hardcoded language arrays with database-driven options
3. ✅ Update profile types to use `language_ids` instead of `languages`
4. ✅ Remove references to `city` and `state` fields

## Migration Order

For a fresh database, run migrations in this order:

1. `001-base.sql`
2. `002-location-management-simple-2025-01-15.sql`
3. `003-profile-completion-tracking-2025-01-15.sql`
4. `004-profile-location-fields-2025-01-15.sql`
5. `005-setup-certificate-storage-2025-01-15.sql`
6. `006-normalize-schema-2025-01-16.sql`
7. `007-profile-picture-storage-2025-07-13.sql`
8. `008-specializations-normalization-2025-07-22.sql` ← **Latest**

## Managing Migration Files

### Adding New Migrations

When adding new migration files:

1. Use the next sequential number (008-, 009-, etc.)
2. Include a descriptive name and date
3. Run the renaming script if needed: `node scripts/rename-migrations.js --dry-run`

### Renaming Existing Files

Use the provided script to maintain proper sequential order:

```bash
# Preview changes
node scripts/rename-migrations.js --dry-run

# Apply changes with confirmation
node scripts/rename-migrations.js

# Apply changes without confirmation
node scripts/rename-migrations.js --confirm
```

## Rollback Strategy

If you need to rollback the schema normalization:

1. The old `languages` TEXT[] column is preserved
2. You can re-add `city` and `state` columns if needed
3. Update frontend components to use old field names
4. Consider creating a rollback script if permanent rollback is needed
