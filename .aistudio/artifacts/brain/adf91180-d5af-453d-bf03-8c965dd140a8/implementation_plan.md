# DeshiMart — Mobile Viewport Adaptation Plan for "Welcome Back" & "Create Account"

Optimize the **Welcome Back (`step 4`)** and **Create Account (`step 5`)** screens so every element fits naturally inside mobile viewports (`360px–430px` wide, `640px–844px` tall) with zero vertical overflow or cramped scrolling.

---

## User Review & Confirmed Decisions

> [!IMPORTANT]
> All layout decisions confirmed in Phase 1 are incorporated below:

- **Confirmed Decision 1 (Zero-Scroll Mobile Viewport Fit)**: Both **Welcome Back** and **Create Account** screens will be proportioned to fit 100% within a single mobile screen height (`dvh`) without vertical scrolling on standard smartphones, while retaining `overflow-y-auto` as a safe fallback for ultra-short landscape or split-screen viewports.
- **Confirmed Decision 2 (2-Column Social Auth Buttons)**: Replace the two stacked full-width social buttons (`Continue with Google` and `Continue with Facebook`) with a single-row **2-column side-by-side grid (`Google` | `Facebook`)**, saving ~52px of vertical space.
- **Confirmed Decision 3 (Compact Header, Logo & Form Spacing)**:
  - Compact top utility bar (`px-5 pt-4 pb-4`), scaled-down brand bag badge (`44×44px`), tight headline + subtitle lockup, and inline **Password + Forgot Password?** label row (eliminating a standalone vertical row).
- **Confirmed Decision 4 (Subtle Admin Console Footer Toggle)**:
  - Remove the bulky top segmented role switcher box (`Customer Account | Admin Console`) from the top of the form and move the **Admin Console / Customer Account** mode toggle into a subtle, clean link in the bottom footer area.

---

## 1. Overview & Spatial Budget Analysis

### Why the Previous Layout Overflowed Mobile Screens
Previously, the **Welcome Back** screen stacked 11 separate vertical blocks totaling `~690px` of fixed height:
1. Top bar (`36px`) + top padding (`28px`)
2. Brand bag logo (`52px` + margins)
3. Title + Subtitle (`56px`)
4. Segmented Role Switcher (`44px` + `14px` margin)
5. Email input block (`68px`)
6. Password input block (`68px`)
7. Standalone `Forgot Password?` row (`24px` + `12px` margin)
8. Primary `Login` button (`48px`)
9. `or` divider (`36px`)
10. Two stacked social buttons (`44px + 8px + 44px = 96px`)
11. Bottom Register link (`36px` + bottom padding `24px`)

### New Mobile-Fitted Spatial Budget (`~510px` Total Content Height)
By consolidating vertical redundancies while keeping accessible touch targets (`44px` inputs and buttons):
1. **Top Utility Bar (`36px`)**: Left `Back` button + Right `Skip to Store →` action.
2. **Compact Brand Header (`78px`)**: `44×44px` animated bag emblem + `20px` bold heading (`Welcome Back` / `Create Your Account`) + 1-line subtitle (`Sign in to continue global shopping` or `Admin Console sign-in mode active` when toggled).
3. **Streamlined Form (`188px` on Login / `236px` on Register)**:
   - `Email or Phone` input (`h-10 sm:h-11 rounded-xl`).
   - `Password` input with **`Forgot Password?` placed inline on the right side of the `Password` label row**, saving `32px`.
   - On **Create Account**, compact `Full Name`, `Phone Number`, and `Password` (with inline `✓ 8+ chars` indicator on the Password label row, saving another `28px`).
   - Primary `Login` / `Register` CTA button (`h-11 rounded-xl`).
4. **Side-by-Side Social Auth Row (`68px`)**:
   - Compact `or continue with` divider (`my-2.5`).
   - `grid-cols-2 gap-2.5` row with **Google** and **Facebook** buttons (`h-10 sm:h-11 rounded-xl`, single-line `whitespace-nowrap`).
5. **Footer Bar with Register/Login Switch & Subtle Admin Link (`48px`)**:
   - Primary account switch (`Don't have an account? Register` / `Already have an account? Login`).
   - Subtle secondary footer link on Login: `Staff Admin Console →` (or `← Switch to Customer Sign In` when Admin mode is active) that pre-fills the demo credentials and toggles `loginRole`.

---

## 2. Technical Architecture & Layout Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│           Mobile Viewport Shell (360px–430px × 100dvh)              │
│   px-5 py-4 flex flex-col justify-between overflow-y-auto           │
├─────────────────────────────────────────────────────────────────────┤
│  1. Top Navigation Row (h-9)                                        │
│     [ ← Back ]                                  [ Skip to Store → ] │
│                                                                     │
│  2. Compact Brand & Title Lockup                                    │
│                     [ 44×44 BagLogoSvg ]                            │
│              Welcome Back / Create Your Account                     │
│          Sign in to your DeshiMart cross-border account             │
│                                                                     │
│  3. Compact Auth Form (space-y-2.5)                                 │
│     ├─ Email or Phone Label                                         │
│     │  [ tanvir.ahmed@deshimart.bd                             ]    │
│     ├─ Password Label                        [ Forgot Password? ]   │
│     │  [ ••••••••••••                                      (👁) ]    │
│     └─ [                     Login (h-11)                      ]    │
│                                                                     │
│  4. 2-Column Social Auth Grid                                       │
│     ─────────────── or continue with ───────────────                │
│     [  (G) Google  ]                       [  (f) Facebook  ]       │
│                                                                     │
│  5. Compact Footer & Subtle Admin Mode Switch                       │
│     Don't have an account? Register                                 │
│     Staff member? Switch to Admin Console →                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Interactive State & Handler Mapping
- **Inline `Forgot Password?`**: Placed in `flex items-center justify-between mb-1` alongside the `Password` `<label>` on Step 4 (`Login`), triggering the password reset toast without consuming an extra row.
- **Inline Password Length Indicator (Step 5 `Register`)**: Placed in `flex items-center justify-between mb-1` alongside the `Password` `<label>` (`✓ 8+ chars` in emerald when `regPassword.length >= 8`, muted `Min. 8 chars` otherwise), eliminating the standalone hint row below the input.
- **2-Column Social Buttons**: Both Step 4 (`Login`) and Step 5 (`Register`) render `<div className="grid grid-cols-2 gap-2.5">` containing the Google and Facebook buttons with concise `Google` and `Facebook` labels (`whitespace-nowrap`).
- **Footer Admin Console Switcher (Step 4 `Login`)**: Clicking `Admin Console Login →` toggles `loginRole` to `'admin'` (pre-filling `admin@deshimart.bd` and showing a subtle emerald indicator badge in the subtitle), while clicking `← Back to Customer Login` restores `'customer'` mode (`tanvir.ahmed@deshimart.bd`).
