# Type System Guide

## Overview

This document outlines the comprehensive enum-driven type system used throughout the Audit-it platform for maximum type safety, maintainability, and developer experience.

## Type Organization

### File Structure

```
src/types/
├── common.type.ts      # Reusable across entire app
├── auth.type.ts        # Authentication domain
├── profile.type.ts     # Profile/user domain
├── ui.type.ts          # UI component types
└── location.type.ts    # Location/geography types
```

### Common Types (`src/types/common.type.ts`)

**Purpose**: Reusable types that can be used across any feature or component.

```typescript
export enum StatusMessageType {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

export interface StatusMessage {
  type: StatusMessageType;
  text: string;
}

export enum LoadingState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

export enum AsyncState {
  IDLE = "idle",
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}
```

### Auth Types (`src/types/auth.type.ts`)

**Purpose**: Authentication-specific enums and interfaces.

```typescript
export enum AuthTab {
  SIGNIN = "signin",
  SIGNUP = "signup",
}

export enum AuthErrorType {
  ACCESS_DENIED = "access_denied",
  CALLBACK_ERROR = "callback_error",
  CANCELLED = "cancelled",
  DEFAULT = "default",
}

export enum AuthLoadingState {
  AUTHENTICATING = "authenticating",
  REDIRECTING = "redirecting",
  LOADING = "loading",
  SETTING_UP = "settingUp",
}
```

### UI Types (`src/types/ui.type.ts`)

**Purpose**: Component variants, sizes, and UI-specific enums.

```typescript
export enum LoadingAction {
  SAVING = "saving",
  UPLOADING = "uploading",
  SEARCHING = "searching",
  PROCESSING = "processing",
  LOADING = "loading",
  SYNCING = "syncing",
  DOWNLOADING = "downloading",
}
```

## Usage Patterns

### Component State Management

```typescript
// ✅ GOOD: Enum-driven state
import { AuthTab } from "@/src/types/auth.type";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";

const [activeTab, setActiveTab] = useState<AuthTab>(AuthTab.SIGNIN);
const [message, setMessage] = useState<StatusMessage | null>(null);

// Type-safe message creation
const showSuccess = (text: string) => {
  setMessage({ type: StatusMessageType.SUCCESS, text });
};

// ❌ BAD: String literals
const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
```

### Component Props

```typescript
// ✅ GOOD: Enum-based props
interface AuthFormProps {
  mode: AuthTab;
  onError: (message: StatusMessage) => void;
}

// ❌ BAD: String union props
interface AuthFormProps {
  mode: "signin" | "signup";
  onError: (message: { type: string; text: string }) => void;
}
```

### Constants and Mappings

```typescript
// ✅ GOOD: Type-safe constant mappings
import { AuthErrorType } from "@/src/types/auth.type";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";

export const AUTH_ERROR_MESSAGES: Record<AuthErrorType, StatusMessage> = {
  [AuthErrorType.ACCESS_DENIED]: {
    type: StatusMessageType.INFO,
    text: "Sign in was cancelled. You can try again whenever you're ready.",
  },
  [AuthErrorType.CALLBACK_ERROR]: {
    type: StatusMessageType.ERROR,
    text: "There was an error during sign in. Please try again.",
  },
};
```

### Helper Functions

```typescript
// ✅ GOOD: Type-safe helper with enum handling
export function getAuthErrorMessage(errorCode: string | null): StatusMessage {
  const errorType = getAuthErrorType(errorCode);
  return AUTH_ERROR_MESSAGES[errorType];
}

function getAuthErrorType(errorCode: string | null): AuthErrorType {
  if (!errorCode) return AuthErrorType.DEFAULT;

  const enumValues = Object.values(AuthErrorType) as string[];
  if (enumValues.includes(errorCode)) {
    return errorCode as AuthErrorType;
  }

  return AuthErrorType.DEFAULT;
}
```

## Import Organization

### Recommended Import Structure

```typescript
// 1. React and third-party imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. Internal components
import { StatusMessage } from "@/src/components/common/StatusMessage.component";
import { Loader } from "@/src/components/common/Loader.component";

// 3. Type imports (grouped by domain)
import { StatusMessage as StatusMessageType, StatusMessageType as MessageType } from "@/src/types/common.type";
import { AuthTab, AuthErrorType } from "@/src/types/auth.type";
import { LoadingAction } from "@/src/types/ui.type";

// 4. Utilities and helpers
import { getAuthErrorMessage } from "@/src/helpers/auth.helper";
```

## Benefits

### Compile-Time Safety

```typescript
// ✅ TypeScript catches errors at compile time
setActiveTab(AuthTab.SIGNIN); // Valid
setActiveTab("sign-in"); // ❌ Compile error!
```

### Autocomplete Support

```typescript
// ✅ Full IntelliSense for enum values
StatusMessageType.   // Shows: ERROR, INFO, SUCCESS, WARNING
AuthTab.             // Shows: SIGNIN, SIGNUP
LoadingAction.       // Shows: SAVING, UPLOADING, etc.
```

### Refactoring Safety

```typescript
// ✅ Renaming enum values updates all usages
export enum AuthTab {
  SIGN_IN = "signin", // Renamed from SIGNIN
  SIGN_UP = "signup", // Renamed from SIGNUP
}
// All component usages automatically update
```

### Self-Documenting Code

```typescript
// ✅ Clear intent with enum values
<Loader action={LoadingAction.UPLOADING} />        // Obviously uploading
<StatusMessage type={StatusMessageType.WARNING} /> // Obviously a warning

// ❌ Unclear intent with strings
<Loader action="uploading" />     // What other actions exist?
<StatusMessage type="warning" />  // What other types exist?
```

## Migration Guidelines

### From String Literals to Enums

```typescript
// BEFORE: String literals
const [tab, setTab] = useState<"signin" | "signup">("signin");
const message = { type: "error", text: "Failed" };

// AFTER: Enum-driven
const [tab, setTab] = useState<AuthTab>(AuthTab.SIGNIN);
const message: StatusMessage = { type: StatusMessageType.ERROR, text: "Failed" };
```

### From Objects to Records

```typescript
// BEFORE: Plain object
const errorMessages = {
  access_denied: { type: "info", text: "Cancelled" },
  callback_error: { type: "error", text: "Error" },
};

// AFTER: Type-safe Record
const errorMessages: Record<AuthErrorType, StatusMessage> = {
  [AuthErrorType.ACCESS_DENIED]: { type: StatusMessageType.INFO, text: "Cancelled" },
  [AuthErrorType.CALLBACK_ERROR]: { type: StatusMessageType.ERROR, text: "Error" },
};
```

## Best Practices

### 1. Enum Naming

- Use descriptive, unambiguous names
- Use SCREAMING_SNAKE_CASE for enum values
- Group related enums in appropriate type files

### 2. Enum Values

- Use lowercase strings for runtime values
- Keep values concise but clear
- Maintain consistency across similar enums

### 3. Type Organization

- **Common types**: Reusable across multiple features
- **Domain types**: Specific to business domains (auth, profile, etc.)
- **UI types**: Component variants and sizes
- **Avoid**: Mixed concerns in single type files

### 4. Import Patterns

- Import types by category
- Use descriptive type aliases when needed
- Prefer explicit imports over barrel exports

This enum-driven type system ensures maximum type safety, excellent developer experience, and maintainable code across the entire Audit-it platform.
