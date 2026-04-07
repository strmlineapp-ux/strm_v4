# Strm_: Global Blueprint (2026)

> **Pronunciation:** "Streamline"  
> **Brand Note:** The underscore is a core visual element of the **Strm_** brand identity.
>
> This document serves as the definitive 2026 technical and functional blueprint for **Strm_**, a high-performance workspace for task management, real-time event scheduling, and production coordination. This version **supersedes all "AgileFlow" documentation.**

---

## 1. Authentication Blueprint (2026)
This section outlines the secure, administrator-controlled access model for the Strm_ environment.

### 1.1 Authentication & Onboarding Flow
The application uses Google Sign-In as its sole method of authentication. Access is strictly controlled via three primary methods:

* **Method A: First User Auto-Approval (Bootstrap Flow):** Automatically grants administrative access to the first user in a new environment.
* **Method B: Administrator Invitation (Recommended):** Admins pre-approve email addresses, triggering a Cloud Function to send a welcome invite to the **Strm_ login** page.
* **Method C: User-Initiated Access Request:** Uninvited users are created in a **'Viewer'** state, restricting all access until an administrator approves them via in-app or email notification.

---

## 2. Data Documentation (2026)
Detailed breakdown of data structures and the 2026 modernized fetching strategy.

### 2.1 Data Fetching Strategy: Scalable On-Demand Model
1. **Edge-First Resolution (2026 Update):** To minimize latency for a global workforce, Strm_ utilizes **Multi-Region Cloud Functions (2nd Gen)** to resolve workspace configurations and user authentication at the network edge. By leveraging the **Global External HTTP(S) Load Balancer**, the initial load is delivered in **under 100ms** by terminating the user's connection at the closest geographical node.
2. **Minimal Initial Load:** Only the `User` object and global `AppSettings` are loaded at startup to keep the initial render fast.
3. **Context-Aware Fetching:** High-volume data (Projects, Events, Tasks) is fetched on-demand based on user navigation or visible calendar ranges.

### 2.2 Multi-Workspace Architecture
Strm_ scales via a hybrid isolation model:
* **Model 1 (Logical):** Shared Firebase project using a mandatory `workspaceId` filter on every document.
* **Model 2 (Physical):** Dedicated Firebase projects for enterprise clients, resolved dynamically at the Edge.

---

## 3. Design System & UI Patterns (2026)
Established patterns ensuring a consistent experience across the environment.

### 3.1 Core Patterns
* **Standardized Cards:** All management cards use `bg-transparent` with `p-2` compact padding and `break-words` title wrapping.
* **Inline Editor:** Text elements transform into borderless, transparent input fields for seamless editing.
* **Draggable Card Management:** A masonry-style grid using `pointerWithin` collision detection. Interactive elements are hidden during active drags to ensure UI stability.
* **Icon & Color Editing:** A unified `<IconColorPicker />` pattern using `react-colorful` for instant entity customization.
* **Compact Action Dialog:** Minimalist, icon-driven dialogs for focused actions like 2FA or low-risk deletions.
* **Seamless Pages:** Overview, Admin, Calendar, and Tasks are "header-less" to maximize workspace focus.

---

## 4. User Manual (2026)
Core guide for navigating and managing the Strm_ application.

* **Calendar:** Supports Month, Week, Day, and a specialized **Production Schedule** view organized by location. Includes "Easy Booking" for click-to-create event functionality.
* **Tasks:** Features automatic status grouping and a centralized `add_circle` button for new entries.
* **Account Settings:** A "seamless" page featuring a **Compact Preferences Row** for managing theme, custom primary colors, and font weights.
* **Admin Management:** Dedicated portal for promoting users (secured by 2FA), pre-approving emails, and reordering application pages via drag-and-drop.

---
**End of Blueprint**