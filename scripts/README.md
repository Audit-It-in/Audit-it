# Scripts Directory

This directory contains utility scripts for the Audit-it CA Platform.

## Available Scripts

### Migration Management

#### `rename-migrations.js`
Automatically renames SQL migration files with sequential prefixes for clear execution order.

**Purpose**: Ensures migration files have a clear, sequential naming convention (001-, 002-, etc.) based on chronological order.

**Usage:**
```bash
# Preview changes without making any modifications
node scripts/rename-migrations.js --dry-run

# Rename files with interactive confirmation
node scripts/rename-migrations.js

# Rename files without confirmation prompt
node scripts/rename-migrations.js --confirm
```

**Features:**
- Extracts dates from filenames (YYYY-MM-DD format)
- Sorts files chronologically, then alphabetically
- Adds three-digit sequential prefixes (001-, 002-, 003-, etc.)
- Safety measures with dry-run mode and confirmation prompts
- Comprehensive logging and error handling

**Example Output:**
```
📋 Proposed execution order:

   001. 🔄 RENAME base.sql
        → 001-base.sql
   002. 🔄 RENAME location-management-simple-2025-01-15.sql
        → 002-location-management-simple-2025-01-15.sql
```

### Location Data Processing

#### `process-location-data.js`
Processes CSV location data and imports it into the database.

**Purpose**: Import Indian postal data (states, districts) from CSV files into the database.

**Features:**
- Batch processing for performance
- Duplicate detection and prevention
- File hash tracking to avoid reprocessing
- Comprehensive logging and statistics

#### `clear-location-imports.js`
Utility to clear imported location data and reset the import tracking.

**Purpose**: Clean up location data for testing or re-importing fresh data.

## Usage Guidelines

### Before Running Scripts

1. **Backup your data**: Always ensure you have backups before running scripts that modify files or data
2. **Test mode first**: Use dry-run or test modes when available
3. **Check dependencies**: Ensure Node.js and required packages are installed
4. **Review output**: Always review script output before confirming destructive operations

### Adding New Scripts

When adding new scripts:
1. Follow the existing naming conventions
2. Include comprehensive error handling
3. Add dry-run or preview modes for destructive operations
4. Include clear logging and progress indicators
5. Update this README with script documentation

## Error Handling

All scripts include:
- Input validation and error checking
- Graceful failure handling
- Clear error messages with context
- Exit codes for programmatic usage
- Safety confirmations for destructive operations
