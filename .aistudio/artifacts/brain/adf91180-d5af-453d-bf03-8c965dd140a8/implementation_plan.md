# DeshiMart — Professional Login Screen Typography & UI/UX Refinement Plan

Refining the DeshiMart authentication flow (**Welcome Back** and **Create Your Account**) into a high-trust, typographically precise, WCAG 2.2 AA accessible cross-border commerce experience with semantic color tokens, an 8-point spatial grid, inline field validation, loading states, and natural viewport distribution.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Key Decisions & Confirmed Architecture**:
> - **Brand Color & Semantic Tokens**: Adopt the exact specified brand palette (`#065F46` primary emerald, `#16865F` interactive green, `#047857` hover green, `#17231E` main ink, `#64756C` secondary text, `#829188` muted text, `#DCE7E0` input border, `#F5F8F6` input surface, `#B42318` semantic error) as dedicated CSS custom properties.
> - **Typography Scale (`Plus Jakarta Sans` + `Noto Sans Bengali`)**: Establish the exact weight and size hierarchy (`22–24px / 700` heading, `13–14px / 400` subtitle, `12–13px / 600` field labels, `13–14px / 500` inputs, `14px / 700` primary CTA, `12px / 600` recovery & social actions, `12–13px / 400–600` registration prompt, `11–12px / 500` staff console link).
> - **Brand Mark & Vertical Rhythm**: Refine the DeshiMart shopping-bag mark to a crisp `38px × 38px` proportion inside a subtle soft-emerald container (`48px × 48px` with restrained shadow), anchored naturally above the heading (`12px` icon-to-heading, `6px` heading-to-subtitle, `24px` subtitle-to-form) without floating in an artificial middle gap or crowding the Email/Phone box.
> - **Clean Initial Field State & Inline Validation**: Do not permanently hardcode a real user email/password into the initial input values; provide clean placeholders (`name@example.com` / `+880 1712 345678`) with one-tap demo autofill support when switching to Staff/Admin mode or submitting, plus explicit inline field error messages (`role="alert"`, `aria-invalid`, `aria-describedby`) and a non-jumping loading state on submit.

---

## 1. Overview & Core Concept

- **What It Does**: Elevates the DeshiMart **Login (`step 4`)** and **Create Account (`step 5`)** screens from a basic functional form into an art-directed, mobile-first cross-border shopping authentication experience.
- **Target Audience / Persona**: Bangladeshi cross-border shoppers signing in via mobile or desktop to track landed-cost orders, manage bKash/Nagad checkouts, or access the authorized Staff/Admin Console.
- **Key Value**: Eliminates visual crowding between the brand header and form, replaces ad-hoc font sizes and low-contrast borders with a cohesive typographic and color token system, enforces 44×44px accessible touch targets, and provides clear field-level validation and loading feedback.

---

## 2. User Experience & Visual Design

### Visual Identity & Semantic Tokens

| Token Purpose | CSS Variable | Value | Usage |
| :--- | :--- | :--- | :---
| **Primary Emerald** | `--auth-primary` | `#065F46` | Primary Login button surface, brand mark |
| **Interactive Green** | `--auth-interactive` | `#16865F` | Skip to Store, Forgot Password?, Register link |
| **Hover Green** | `--auth-hover` | `#047857` | Primary CTA hover & active state |
| **Main Text** | `--auth-text-main` | `#17231E` | Heading, labels, input text, social button text |
| **Secondary Text** | `--auth-text-secondary` | `#64756C` | Subtitle, registration prompt sentence |
| **Muted Text** | `--auth-text-muted` | `#829188` | Divider text, placeholder text, Admin Console link |
| **Border** | `--auth-border` | `#DCE7E0` | Input borders, social button borders |
| **Input Background** | `--auth-input-bg` | `#F5F8F6` | Email/Phone and Password field surface |
| **Surface** | `--auth-surface` | `#FFFFFF` | Page canvas & social button surface |
| **Error** | `--auth-error` | `#B42318` | Invalid border, error icon, inline error message |
| **Focus Ring** | `--auth-focus-ring` | `rgba(22, 134, 95, 0.16)` | Accessible 3px outer focus ring on inputs & buttons |

### Typography Hierarchy (`Plus Jakarta Sans` & `Noto Sans Bengali`)

| Element | Font Size | Weight | Line Height | Color Token |
| :--- | :--- | :--- | :--- | :--- |
| **Screen Heading (`Welcome Back`)** | `23px` (`22px` on 320px) | `700` | `1.25` | `#17231E` |
| **Supporting Subtitle** | `13.5px` | `400` | `1.5` | `#64756C` |
| **Field Labels (`Email or Phone`, `Password`)** | `12.5px` | `600` | `1.4` | `#17231E` |
| **Input Text** | `13.5px` | `500` | `1.45` | `#17231E` |
| **Primary Button (`Login`)** | `14px` | `700` | `1.4` | `#FFFFFF` |
| **Password Recovery (`Forgot Password?`)** | `12px` | `600` | `1.4` | `#16865F` |
| **Social Login Labels (`Google`, `Facebook`)** | `12.5px` | `600` | `1.4` | `#17231E` |
| **Registration Prompt** | `12.5px` | `400` (`600` link) | `1.5` | `#64756C` / `#16865F` |
| **Admin Console Link** | `11.5px` | `500` | `1.5` | `#829188` |
| **Top Nav Action (`Skip to Store →`)** | `12.5px` | `600` | `1.4` | `#16865F` |

### 8-Point Spatial & Vertical Composition

1. **Top Navigation Bar**:
   - Left: `44×44px` minimum interactive back button (`-ml-2` optical alignment so the chevron aligns flush with the left form edge) with hover/focus/active states.
   - Right: `Skip to Store →` in `12.5px` semibold `#16865F` with `min-h-[44px]` touch target and balanced arrow spacing.
2. **Brand Introduction (`AuthBrandHeader`)**:
   - Crisp `38×38px` DeshiMart shopping-bag SVG mark inside a subtle `48×48px` soft-emerald badge (`#EEF6F2` with `1px solid #DCE7E0` and restrained shadow).
   - `12px` vertical gap to the single-line heading (**Welcome Back**), `6px` gap to the supporting subtitle (**Sign in to your DeshiMart cross-border account**), and `24px` (`mb-6`) architectural separation before the first form field.
3. **Authentication Form**:
   - `16px` (`space-y-4`) between field groups.
   - `6px` (`mb-1.5`) between label and input box.
   - Input boxes: `46px` height (`h-[46px]`), `13px` horizontal padding (`px-3.5`), `12px` border radius (`rounded-xl`), `1.5px solid #DCE7E0` border, `#F5F8F6` background, `#16865F` focus border with `3px` emerald tint focus ring, and `#B42318` error border with inline accessible message when invalid.
   - Password field: Flex label row with left-aligned `Password` label and right-aligned `Forgot Password?` button (`min-h-[32px]` tap area), `type="password"` by default, and a `44×44px` accessible visibility toggle (`aria-label="Show password"` / `"Hide password"`).
   - Primary Login button: `46px` height (`h-[46px]`), `100%` width, `12px` radius, solid `#065F46` background (`#047857` hover), `14px` bold white text, subtle restrained shadow, and non-jumping inline spinner during authentication.
4. **Social Authentication**:
   - `20px` (`my-5`) separation with `11.5px` `#829188` `"or continue with"` divider flanked by `1px` `#DCE7E0` hairlines.
   - 2-column grid (`grid-cols-2 gap-3`) of `44px`-tall white buttons (`#FFFFFF`), `1.5px solid #DCE7E0` border, official Google & Facebook SVG marks (`18×18px`), and `12.5px` semibold `#17231E` labels.
5. **Registration & Staff Footer**:
   - Natural vertical flow (`mt-auto pt-6 pb-1`) so it anchors cleanly near the bottom on tall screens without creating an awkward void, and scrolls naturally on short screens (`320×700`) or when the mobile keyboard opens.
   - Centered `"Don't have an account? Register"` (`12.5px`) above a discreet `"Staff member? Switch to Admin Console →"` (`11.5px`) secondary action with `8px` separation.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Flexible Scroll-Safe Vertical Distribution vs. Rigid `justify-between` Void**
  - *Chosen Approach*: Use a scroll-safe flex column (`min-h-full flex flex-col px-5 pt-3 pb-5`) where the main auth body (`my-auto py-3`) groups the Brand Header + Form + Social Login cohesively with a `24px` header-to-form gap, and the footer sits cleanly below with `pt-5`.
  - *Why*: Eliminates the unexplained gap between Social Login and the Footer on tall screens while preventing overlap on 320px/short screens or when the virtual keyboard opens.
- **Decision 2: Unhardcoded Credentials with Seamless Demo Convenience**
  - *Chosen Approach*: Initialize `loginIdentifier` and `loginPassword` as empty strings (`""`) with clear placeholders (`name@example.com`), while providing inline field validation if submitted empty and preserving instant role switching for the Admin Console.
  - *Why*: Meets the mandatory requirement not to hardcode real user credentials into the inputs while keeping validation and authentication flows 100% functional.

---

## 4. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────────────────────┐
│                     SplashOnboarding (Step 4 & Step 5)                    │
├───────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 1. AuthTopBar                                                       │  │
│  │    ├─ Back Button (44×44px target, -ml-2 optical left alignment)    │  │
│  │    └─ Skip to Store → (12.5px semibold #16865F, min-h-[44px])       │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 2. AuthBrandHeader (mb-6 / 24px separation from form)               │  │
│  │    ├─ BagLogoSvg (38×38px mark in subtle 48×48px #EEF6F2 container) │  │
│  │    ├─ Screen Heading (23px, 700, #17231E, -0.02em, 1.25 lh)         │  │
│  │    └─ Supporting Subtitle (13.5px, 400, #64756C, 1.5 lh)            │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 3. AuthForm (Programmatic labels, ARIA errors, Loading protection)  │  │
│  │    ├─ Email/Phone Field (h-[46px], #F5F8F6 bg, #DCE7E0 border)      │  │
│  │    ├─ Password Field + Forgot Password? + 44×44px Eye Toggle        │  │
│  │    └─ Primary Login Button (h-[46px], #065F46 solid, loading state) │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 4. SocialAuthSection                                                │  │
│  │    ├─ Hairline Divider ("or continue with", 11.5px #829188)         │  │
│  │    └─ 2-Column Provider Grid (Google & Facebook, h-[44px])          │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 5. AuthFooter (Natural scroll-safe bottom placement)                │  │
│  │    ├─ Registration Prompt ("Don't have an account? Register")       │  │
│  │    └─ Discreet Staff Link ("Staff member? Switch to Admin Console") │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

### Interactive State & Accessibility Mapping
- **Programmatic Labels & ARIA**: Connect `<label htmlFor>` to `<input id>`, attach `aria-invalid` and `aria-describedby` to inline error messages (`role="alert"`), and set `aria-label={showLoginPw ? 'Hide password' : 'Show password'}` on the visibility toggle.
- **Duplicate Submission Guard**: Add `isSubmitting` state (`150ms–350ms` transition feedback with a stable inline spinner) so rapid taps cannot trigger duplicate login calls or shift button width.
- **Reduced Motion**: Remove delayed layout entrance animations on the auth controls so inputs are immediately interactive at `0ms` latency and compliant with `prefers-reduced-motion`.
