---
title: Angular Common Agent
description: Global rules and conventions applicable to all Angular projects in the organization.
version: 1.0.1
scope: global
lastUpdated: 2025-11-19
---

# 🧭 1. Purpose

This agent defines the **general rules and conventions** applicable to any **Angular (v17+)** project, without imposing specific structures, libraries, or stacks.  
It seeks to maintain **consistency, maintainability, and clarity** across all repositories.

---

# 📜 2. Guiding Principles

1. **Single Responsibility Principle (SRP):** each entity must have a single clear responsibility.
2. **Separation of Concerns:** separate presentation, business logic, and data.
3. **Consistency > personal preference.**
4. **Clarity over complexity.**
5. **Composition over inheritance.**
6. **Readability as a technical priority.**

---

# 🧱 3. Naming Conventions

| Element | Convention | Example |
|-----------|-------------|----------|
| Files | kebab-case | `user-profile.component.ts` |
| Classes / Components / Services / Pipes | PascalCase | `UserProfileComponent`, `UserService` |
| Variables / functions / properties | camelCase | `userProfile`, `getUser()` |
| Interfaces / types | PascalCase (no `I` prefix) | `User`, `UserResponse` |
| Component selectors | standard prefix (`app-` or domain) | `<app-card>`, `<company-button>` |
| Tests | next to the artifact | `user.service.spec.ts` |

---

# 🧩 4. Code Organization

- Structure depends on the project, but these principles must be respected:
    - Maintain **cohesion and loose coupling**.
    - Avoid circular dependencies.
    - Components: single responsibility.
    - Services: encapsulate business logic or data access.
    - Do not include business logic in components.

---

# 🎨 4.1. Component Structure

**Templates and Styles must always be in separate files:**

- **Templates (HTML):** Always use `templateUrl: './component.html'`
- **Styles (CSS/SCSS):** Always use `styleUrl: './component.scss'` (preferred in Angular v17+)
- **Never use inline templates or styles** (`template:` or `styles:` properties)

**Rationale:**
- Maintains **Separation of Concerns** (HTML, CSS, TypeScript are separate)
- Improves **readability and maintainability**
- Facilitates **code review** (changes are isolated by file type)
- Enables **IDE features** (syntax highlighting, autocomplete, linting)
- Allows **concurrent editing** by multiple developers

**Example:**

✅ **Correct:**
```typescript
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent { }
```

❌ **Incorrect:**
```typescript
@Component({
  selector: 'app-user-profile',
  template: `<div>...</div>`,  // Never use inline templates
  styles: [`.class {...}`]      // Never use inline styles
})
export class UserProfileComponent { }
```

**File structure:**
```
user-profile/
├── user-profile.component.ts
├── user-profile.component.html
├── user-profile.component.scss
└── user-profile.component.spec.ts
```

---

# 🧠 5. Angular Architecture

- **NgModules** or **Standalone Components** depending on context.
- **Routing:** routes per feature, use lazy-loading when it adds value.
- **State management:**
    - Use **NgRx** only if global state is needed.
    - Simple local state is valid and preferable if it meets the needs.
- **Reactivity:** Signals are optional.
- **Dependency Injection:** prefer `inject()` when possible, `constructor()` is still valid.
- **Global configuration:** centralize in `app.config.ts` or `app.module.ts`.

---

# 🧾 6. Typing and TypeScript

- `"strict": true` enabled in `tsconfig.json`.
- Avoid `any`; prefer `unknown` or explicit typing.
- Use **interfaces or types** for data contracts, without `I` prefix.
- Type all public functions and component outputs.
- Export only what is necessary.

---

# 🧹 7. Code Quality

- **ESLint** mandatory.
- **Prettier** for formatting.
- No automatic critical rules (each project can extend).
- Minimum common rules:
    - `no-console` (except for temporary debugging)
    - `no-implicit-any`
    - `no-floating-promises`
- Manual PR review prioritizing readability.

---

# 🧪 8. Testing

- **Minimum coverage:** 50%.
- **Unit tests:** Karma.
- **Integration tests:** `TestBed` or `ComponentFixture`.
- **E2E:** not included, managed in specific projects.
- Prioritize testing of components and critical logic.
- Avoid excessive mocks; prefer lightweight stubs or simulated services.

---

# ♻️ 9. Version Control and Pull Requests

- **Conventional commits:**
    - `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- **PRs:** must include clear description and test steps.
- Minimum review by another developer.
- Document relevant decisions in the PR (formal ADRs not required).

---

# 🌍 10. Internationalization (i18n)

- Use **@angular/localize** (official Angular i18n) for static translations, or **@ngx-translate/core** for dynamic translations.
- Files: `assets/i18n/<locale>.json` (for ngx-translate) or Angular's built-in i18n workflow.
- Do not concatenate strings dynamically.
- Use `translate` pipe or `TranslateService` (ngx-translate), or `$localize` (Angular i18n).
- Keep keys consistent and centralized.

---

# 🧩 11. Accessibility (a11y)

- Comply with **WCAG AA**.
- ARIA roles and labels properly defined.
- Keyboard support mandatory.
- Review with **Lighthouse** or manual tools.
- Automation optional, not required.

---

# ⚙️ 12. Performance

- Lazy-loading of modules or features when it improves performance.
- Avoid unnecessary loading of assets and libraries.
- Use `ChangeDetectionStrategy.OnPush` when applicable.
- Review bundle size in production.

---

# 🧾 13. General Best Practices

- Review code before pushing (self-review).
- Comment only what is not obvious.
- Prioritize readability.
- Keep dependencies up to date.
- In legacy projects, do not break compatibility without technical reason.
- Consistency across teams before individual creativity.

---

# ✅ 14. Common Agent Goals

- Unify style and quality across Angular teams.
- Maintain principles of clarity, maintainability, and consistency.
- Do not impose fixed stack or structure.
- Serve as an extensible base for each type of project.

---
