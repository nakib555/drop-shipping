# DeshiMart — Auth Header Elevation & Form Separation Plan

## 1. Visual Diagnosis (From Your Screenshot)

In the current **Welcome Back (`step 4`)** and **Create Your Account (`step 5`)** screens:
- Both the brand header block (`BagLogoSvg` + **Welcome Back** + subtitle) and the form inputs sit inside a single `my-auto` wrapper with only `mt-3` (`12px`) separating the subtitle from the **Email or Phone** label.
- Because the outer container uses `justify-between` with the header bundled directly onto the form, empty vertical space is pushed **above** the logo instead of creating a clean architectural separation **between** the brand hero header and the input card.

---

## 2. Proposed Layout & Spacing Adjustments

We will separate the **Brand Header Block** from the **Form & Social Block** so the logo + heading sit slightly higher toward the top navigation bar, leaving a clean, balanced gap (`24px–28px`) before the **Email or Phone** input field — while still fitting `100%` within a mobile viewport (`640px–844px`) without vertical scrolling.

### Visual Rhythm & Spacing Structure

```
┌──────────────────────────────────────────────────────────┐
│  [←]                                   Skip to Store →   │  ← Top Bar (shrink-0)
├──────────────────────────────────────────────────────────┤
│                      ╭───────────╮                       │  ← Elevated Brand Header
│                      │  [ Bag ]  │ (48×48px with soft    │    Positioned higher (`pt-2`)
│                      ╰───────────╯  emerald halo)        │    with 10px gap to title
│                      Welcome Back                        │
│        Sign in to your DeshiMart cross-border account    │
│                                                          │
│  ↕ 24px–28px Clean Architectural Breathing Room ↕        │  ← Clear separation before
│                                                          │    Email or Phone box
│  Email or Phone                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ name@example.com                                   │  │
│  └────────────────────────────────────────────────────┘  │
│  Password                              Forgot Password?  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ••••••••                                       [👁] │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │                       Login                        │  │
│  └────────────────────────────────────────────────────┘  │
│  ───────────────── or continue with ───────────────────  │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ │
│  │ [G] Google              │ │ [f] Facebook            │ │
│  └─────────────────────────┘ └─────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│             Don't have an account? Register              │  ← Bottom Footer (shrink-0)
│          Staff member? Switch to Admin Console →         │
└──────────────────────────────────────────────────────────┘
```

### Files to Modify
1. **`src/components/screens/SplashOnboarding.tsx`**:
   - **Step 4 (`Welcome Back`)**:
     - Separate the Brand Header (`BagLogoSvg` + `Welcome Back` + subtitle) into its own upper section (`mt-2 mb-6 sm:mb-7`) so it sits higher on the screen and has **24px–28px** of clean breathing room above the `Email or Phone` input field.
     - Refine spacing between the bag icon and `Welcome Back` heading (`mt-2.5`) and between the heading and subtitle (`mt-1`).
   - **Step 5 (`Create Your Account`)**:
     - Apply the matching upper brand header elevation (`mt-1.5 mb-5 sm:mb-6`) so the logo + `Create Your Account` + subtitle sit cleanly above the `Full Name` input field with zero crowding.
2. **`src/index.css`**:
   - Refine `.dm-flow-logo-sm` (`48px × 48px`) so the bag icon and its soft ambient emerald shadow remain crisp and well-proportioned above the title.
