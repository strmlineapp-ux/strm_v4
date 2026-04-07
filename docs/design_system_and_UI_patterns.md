# Strm_: Design System & UI Patterns (2026)

This document outlines the established UI patterns and design choices that ensure a consistent and intuitive user experience across the Strm_ application. These patterns serve as a definitive guide for both current and future development.

---

## Core UI Patterns

### 1. Card & Content Padding
The application favors a compact, information-dense layout. Card components are the primary building block for displaying content.

- **Standard Implementation**: The `CalendarCard`, `TeamCard`, `PageCard`, and `BadgeCollectionCard` serve as the ideal examples of the compact card pattern.
- **Header & Content**: `<CardHeader>` must use `p-2`. `<CardContent>` should use `p-2 pt-0` to keep vertical spacing tight.
- **Card Backgrounds**: Cards use `bg-transparent`, relying on their `border` for definition to create a lighter, modern UI.
- **Text Wrapping**: Titles must use the `break-words` utility to prevent layout breaks from long, unbroken strings.

### 2. Inline Editor
This allows for seamless text editing within the main layout, avoiding disruptive dialogs for simple changes.

- **Interaction**: Clicking text transforms it into an input field that matches the font, size, and weight of the original element (e.g., `font-headline font-thin`).
- **Styling**: Inputs must have a transparent background and no borders/box-shadows.
- **Behavior**: 'Enter' saves; 'Escape' cancels. 
- **Implementation**: A `useEffect` hook must monitor `mousedown` events; clicking outside the input triggers an automatic save.

### 3. Compact Search Input
Encapsulated in `/src/components/common/compact-search-input.tsx`, this provides a minimal filtering interface.

- **Interaction**: Initially hidden behind a `<GoogleSymbol name="search" />` icon with a tooltip.
- **Behavior**: Expands and focuses on click; collapses on `onBlur` if empty.
- **Active State**: An `isActive` prop can make it permanently visible (e.g., in the Icon Picker Popover).

### 4. Text-based Inputs
Transforms standard form inputs into minimalist elements for the **Strm_ login** and simple dialogs.

- **Appearance**: Borderless and transparent. Initially appears as muted placeholder text next to an icon.
- **Application**: Used exclusively for authentication forms and single-field dialogs (e.g., linking a Google Calendar).

### 5. Integrated Add Button
Replaces bulky "Add New" cards with a contextually placed circular control.

- **Appearance**: A circular button with `add_circle`, styled at `text-4xl` and `weight={100}`.
- **Placement**: Adjacent to section titles or within dedicated action areas (e.g., below Tasks tab navigation).

### 6. Icon & Color Editing Flow
The consistent blueprint for modifying an entity’s visual identity via the `<IconColorPicker />`.

- **Trigger**: A single `h-10 w-12` button on the main entity card.
- **Icon Picker**: A `w-80` popover containing a `CompactSearchInput` and a scrollable grid (`h-52`) of icons at `text-4xl`.
- **Color Picker**: Toggled via a side panel within the popover using `react-colorful`. Selecting a swatch instantly applies the change and closes the popover.

### 7. Entity Sharing & Linking
Describes how a **Team**, **Calendar**, or **Badge Collection** exists across multiple contexts while maintaining a single source of truth.

- **Mechanism**: Owners drag items into a "Shared Items" side panel to set the `isShared` flag. Other users can then "link" these items to their own boards.
- **Visual Cues**:
    - **Source of Truth**: Marked with a `change_circle` icon overlay (matching the owner's primary color).
    - **Linked Item**: Marked with a `link` icon overlay (matching the original owner's primary color).
- **Smart Unlinking**: Deleting a linked item only removes the link; deleting an owned item requires a `Compact Action Dialog`.

### 8. Draggable Card Management Blueprint
The gold-standard pattern for managing collections in a responsive, masonry-style grid.

- **Stability**: Individual cards **must** use `break-inside: avoid` to prevent visual splitting across columns.
- **Collision Detection**: `<DndContext>` must use `pointerWithin` for precision.
- **Drag-Ready State**: Upon drag initiation, all interactive elements (delete buttons, expand icons, inline editors) must be hidden to prevent conflicts.
- **Drag Overlay**:
    - **Entities**: Overlay consists only of the icon (`fontSize: '48px'`).
    - **Users**: Overlay consists only of the `<Avatar>`.
    - **Modifiers**: Use `snapCenterToCursor` for smooth tracking.
- **IDs (Critical)**: Draggable IDs must be unique (e.g., `user-sort:${team.id}-${item.id}`); Droppable containers must use **static string literals** (e.g., `id="shared-panel"`).
- **Drop Zone Highlighting**: Highlights must use rings **only** (no background fills). 
    - Standard: `ring-1 ring-border ring-inset`.
    - Destructive: `ring-1 ring-destructive`.

### 9. Compact Action Dialog
A minimalist, non-modal alternative for focused actions.

- **Design**: No footer buttons. Primary actions (Save/Verify) are icon-only buttons in the top-right.
- **Safety**: Captures pointer events (`onPointerDownCapture`) to prevent accidental drag triggers on the underlying UI.

### 10. Compact Deletion Dialog (Deprecated)
**Note**: All deletion confirmations now use the **Compact Action Dialog** pattern.

### 11. Icon Tabs for Page Navigation
Used for high-level page switching (e.g., "Admin Groups" vs "Pages"). Icons are `text-4xl` with `weight={100}`. Tabs are reorderable via drag-and-drop.

### 12. Seamless Single-Tab Pages
For the **Overview**, **Admin**, **Calendar**, and **Tasks** pages, the standard page header (title/icon) is omitted to create a focused, full-screen app experience.

### 13. Responsive Layout with Collapsible Panel
A two-column layout where the side panel (`w-96`) can be collapsed to `w-0`. **Crucially**, padding must be set to `p-0` when closed to ensure the panel occupies zero space.

### 14. Drag-and-Drop Scrolling Clipping
To prevent horizontal "clipping" during a drag, the container for each individual tab's content must have `overflow-hidden` applied.

### 15. Compact Badge Pills
Ultra-thin, pill-shaped badges for dense layouts. Icons are set to `28px` with minimal padding (`py-0 px-1`).

### 16. Team Member Badge Assignment
Exclusively handled via drag-and-drop. Dragging a badge from one member to another triggers the re-assignment. Assigned badges appear as icon-only buttons with solid colored borders.

### 17. Compact Preferences Row
A horizontal row of icon-only buttons for settings (Theme, Primary Color, etc.). **Every button MUST have a `<Tooltip>`** to display the current setting value.

---

## Visual & Theming Elements

### Typography & Icons
- **Font**: Exclusively **Roboto**.
- **Icon Set**: Exclusively **Google Material Symbols** via `<GoogleSymbol />`.
- **Tooltips**: Required for all icon-only buttons to ensure accessibility.

### Emphasis Logic
The application uses a weight-based emphasis system:
- **Low Weight (Thin to Medium)**: Hovering increases the font weight; color remains static.
- **High Weight (Bold)**: Hovering changes the text color to the primary theme color; weight remains static.

### Subtle Visual Cues
- **Lunch Break**: A diagonal line pattern blocks out 12:00 - 14:30 in calendar views.
- **Ownership Badge**: A `16px` icon overlay (`absolute -top-0 -right-3`) on avatars or icons indicates the source of truth.



