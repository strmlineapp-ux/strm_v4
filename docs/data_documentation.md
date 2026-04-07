# Strm_: Data Documentation (2026)

This document provides a detailed breakdown of the data structures, entities, and their relationships within the Strm_ application. It serves as a technical reference for understanding how data flows through the system and interacts with internal and external services.

---

## Data Fetching Strategy: Scalable On-Demand Model

Strm_ employs a highly scalable, on-demand data-fetching strategy optimized for a NoSQL environment and a context-aware user experience. This ensures the application remains fast and responsive, regardless of total system data volume.

1.  **Minimal Initial Load**: When the application starts, it loads only the absolute minimum data required for the user to operate:
   * The current `User` object (profile, preferences, and `memberOfTeamIds`).
   * The global `AppSettings` object (defines page structure and navigation).
   * All other data (Projects, Teams, Calendars, Events, Tasks) is **not** loaded at startup.

2.  **Context-Aware, On-Demand Fetching**: Data is fetched by components precisely when needed, driven by user navigation.
   * **Project & Team Data**: When navigating to a specific project or team page (e.g., `/dashboard/project/id-123`), the component fetches only that specific entity.
   * **Events & Tasks**: High-volume data is fetched on-demand. The Calendar fetches events for the visible date range; the Tasks page fetches tasks upon loading.

3.  **Benefits**:
   * **Scalability**: Initial load time is constant, whether there are 10 or 10,000 projects.
   * **Performance**: Memory usage is minimized by holding only data relevant to the current view.
   * **NoSQL Optimization**: This model aligns with fetching specific documents by ID rather than performing massive, complex queries.

---

## Multi-Workspace Architecture: Flexible Hybrid Model (2026)

Strm_ is designed with a hybrid multi-workspace architecture, allowing the system to scale efficiently via two distinct isolation models.

### Model 1: Shared Database with Logical Isolation (Default)
1.  **Shared Firebase Project**: Multiple workspaces coexist within a primary Firebase project.
2.  **`workspaceId` Field**: Every document in Firestore includes a `workspaceId` field.
3.  **Mandatory Query Filtering**: Every database query **must** be filtered by the current user's `workspaceId`. (e.g., `where("workspaceId", "==", currentUser.workspaceId)`).

### Model 2: Dedicated Database with Physical Isolation (Premium)
1.  **Separate Firebase Project**: Each enterprise workspace is provisioned with an independent Firebase project for maximum isolation.
2.  **No `workspaceId` Needed**: Data is physically isolated at the project level; connection is already scoped to that specific workspace.

### How the Hybrid Model Works
1.  **Workspace Identification**: Identified via hostname (e.g., `workspace-a.strm.app`).
2.  **Dynamic Configuration**: The system retrieves the configuration from a secure central store to determine if it points to the **shared** or **dedicated** project.
3.  **Data Access**: Strm_ services use the retrieved configuration to apply the appropriate querying strategy.

---

## User Entity
**Firestore Collection**: `/users/{userId}`

The `User` is the central entity. Identity, roles, and preferences dictate the experience within the Strm_ environment.

| Data Point | Description & Link to Services |
| :--- | :--- |
| `userId: string` | **Internal.** Unique identifier; primary key for the system. |
| `displayName: string` | **Google Service.** Full name from "Sign in with Google." |
| `email: string` | **Internal / Google Service.** Primary login email verified via Firebase Auth. |
| `isAdmin: boolean` | **Internal.** Flag for administrative privileges and management access. |
| `accountType: 'Full' \| 'Viewer'` | **Internal.** `Viewer` is a restricted state; `Full` has standard permissions. |
| `title?: string` | **Google Service.** Professional title from Google Account profile (requires permission). |
| `avatarUrl?: string` | **Google Service.** URL to profile picture from Google account. |
| `googleCalendarLinked: boolean` | **Application.** Set to `true` only after OAuth consent flow for calendar access. |
| `memberOfTeamIds?: string[]` | **Internal.** Array of `teamId`s; crucial for efficient permission checking. |
| `theme?: 'light' \| 'dark'` | **Internal.** UI color scheme preference. |
| `primaryColor?: string` | **Internal.** User-selected hex color override for the theme. |
| `defaultCalendarView?` | **Internal.** Default layout (Month, Week, Day, Production-Schedule). |
| `modifierKey?` | **Internal.** Selected key (`alt`, `ctrl`, `meta`, `shift`) for secondary actions. |
| `approvedBy?: string` | **Internal.** `userId` of the admin who promoted user from 'Viewer' state. |

---

## Project Entity
**Firestore Collection**: `/projects/{projectId}`

| Data Point | Description |
| :--- | :--- |
| `id: string` | Unique identifier for the project. |
| `name: string` | Display name; editable inline within the Strm_ environment. |
| `owner: { type: 'user', id: string }` | Defines the specific User who owns the project. |
| `isShared: boolean` | Visibility flag for other users. |
| `icon: string` | Google Symbol name for the project identifier. |
| `color: string` | Hex color for the project's visual identity. |

---

## Event Entity
**Firestore Collection**: `/events`

Events are globally stored and linked back to calendars and projects via IDs.

| Data Point | Description |
| :--- | :--- |
| `eventId: string` | **Internal.** Unique identifier. |
| `title: string` | Name of the event. |
| `projectId?: string` | ID of the parent project. |
| `calendarId: string` | ID of the linked internal calendar for color-coding. |
| `googleEventId?: string` | **External.** Corresponding ID in Google Calendar for synchronization. |
| `startTime / endTime` | Date and time bounds for the event. |
| `roleAssignments?` | Map of requested badge names to the assigned `userId`. |
| `priority: string` | The `badgeId` used to signify event priority level. |

---

## Task Entity
**Firestore Sub-Collection**: `/projects/{projectId}/tasks/{taskId}`

| Data Point | Description |
| :--- | :--- |
| `taskId: string` | **Internal.** Unique identifier. |
| `projectId: string` | **Crucial.** The ID of the parent project container. |
| `assignedTo: User[]` | Array of User objects assigned to the task. |
| `status: string` | Current task state (e.g., `not_started`, `in_progress`). |
| `badges?: Record` | Map of `badgeCollectionId` to the specific `badgeId`. |

---

## Shared Calendar Entity
**Firestore Collection**: `/calendars/{calendarId}`

### Synchronization: Google Calendar Push Notifications
1.  **Watch Request**: Backend requests Google Calendar API to "watch" the specific calendar.
2.  **Webhook Notification**: Changes in Google Calendar trigger an instant webhook (HTTPS Cloud Function).
3.  **Workspace-Aware Sync**: Webhook uses `googleCalendarId` to find the internal document and the correct `workspaceId`.
4.  **Targeted Sync**: Triggers the `syncCalendar` flow within the specific workspace context.

| Data Point | Description |
| :--- | :--- |
| `googleCalendarId?` | **External.** The ID enabling the link between Strm_ and Google. |
| `color: string` | Hex code used for event visualization in the Strm_ portal. |
| `isShared?: boolean` | Visibility flag for discovery within the environment. |

---

## Team Entity
**Firestore Collection**: `/teams/{teamId}`

| Data Point | Description |
| :--- | :--- |
| `members: string[]` | Array of `userId`s for all team members. |
| `teamAdmins?: string[]` | Subset of members with team-level administrative rights. |
| `activeBadgeCollections?` | Array of `collectionId`s available for assignment to this team. |

---

## Badge & BadgeCollection Entities

### BadgeCollection Entity
**Firestore Collection**: `/badgeCollections/{collectionId}`
* `badgeIds: string[]`: Array of `badgeId`s belonging to this collection.
* `applications?`: Defines where badges apply (e.g., 'Team Members', 'Events').

### Badge Entity
**Firestore Collection**: `/badges/{badgeId}`
* `ownerCollectionId`: The "source-of-truth" collection ID where the badge was created.
* `icon / color`: Visual identifiers for roles or skills.