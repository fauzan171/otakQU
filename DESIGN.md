# otakQU design direction

Digital wellness mobile prototype for people reducing short-video scrolling. The current visual direction follows the user-supplied `otakQU_OnePager_v3.pdf`, visually reviewed on 29 October 2026. ENERGY 2 / RHYTHM 2 / MOTION 2.

- Use the PDF's warm cream canvas (#F6F1E7), white cards, charcoal text (#1E2A2D), teal (#0F6B63), and sand borders (#E2D8C6). The screen-time overview uses a pale teal panel as its focal point. Teal marks primary actions and healthy progress; amber marks rewards and streaks; brick red marks limits and validation errors.
- Inter matches the typeface embedded in the PDF. Medium and bold weights distinguish supporting copy from headings and numbers. Text uses darker amber and brick-red variants where the PDF's decorative colors do not provide sufficient contrast at mobile text sizes.
- A 390px phone with a dark island and fixed navigation makes the app feel tangible while content scrolls independently.
- Varied cards reflect the hierarchy: screen-time overview, compact counter, guard control, then focus action.
- Brain, shield, leaf, timer and target Lucide icons correspond to cognitive health, protection, calm, time and missions as requested.
- Repeated rounded brain and orbit motifs connect the screen-time hero, breathing timer and achievement medals.
- Motion communicates tab changes, progress updates, switch state and grayscale activation; the breathing loop is an intentional focus aid.
- Shadows belong to the phone and dialogs to indicate physical depth; no decorative glow across cards.
- Status badges identify demo mode, monitoring, mission completion and streaks.
- The phone preview uses the same cream canvas as the document. White cards and sand borders separate sections without decorative shadows. The desktop surround has the PDF's faint warm and green corner tint.
- All profile, usage, weekly trends and streak values are demo fixtures; the app visibly identifies itself as a demo.
- The threshold interceptor, monitored app blocking and grayscale simulate native capabilities inside the web preview only.

## Soluusi rewards revision

The supplied activity and use-case diagrams define the roles and redemption flow. Rewards follows the one-pager's palette and Inter typography while keeping the 390px phone frame and ENERGY 2 / RHYTHM 2 / MOTION 2. No new logo or imagery is needed: show the partner's name as text.

- The Rewards screen's primary decision is which consultation discount the user can afford. Put the coin balance, offer terms, remaining stock, and redemption action before historical progress.
- Teal identifies the available balance and primary confirmation; brick red explains unavailable offers. Stock and insufficient coins always have text labels.
- Separate the catalogue, saved vouchers, and partner demo using labelled controls. The partner view is visibly a local simulation, not an authenticated brand dashboard.
- The confirmation shows the coin cost and resulting balance before committing. A voucher receipt is the focal point after success; the code is selectable and copyable with a manual-copy fallback.
- Use existing card and dialog radii, spacing, and elevation. Ticket, coin, and store icons describe vouchers, balance, and partner inventory. No additional motion or decorative assets.
- Reward values, codes, and stock are labelled demo at the point of selection and confirmation. The Soluusi link opens the real site without implying that it accepts a demo code.
- Layout must fit 320px and preserve readable terms, 44px controls, visible keyboard focus, modal focus trapping, and scrollable dialogs.

## Demo account entry

Login and registration use the cream canvas, white fields and teal action from the one-pager. The brain icon sits in a teal rounded square to match the reference's brand treatment. A single labelled form is the focal point. The account-mode link switches between entering and creating a demo account. Eye controls reveal only the in-memory sample password. Copy identifies the entry as a simulation that accepts any nonempty sample credentials, auto-creates demo identities and does not store passwords. Profile shows the active identifier and a sign-out action. Both forms scroll within the frame on small screens.

## Mobile usability

Supporting copy is enlarged from the previous 7–9px treatment, while primary actions, switches, duration options and budget controls have at least 44px touch areas. The three reward statistics share a single row with wrapping labels. Interactive field borders and focus indicators use darker contrast than decorative card borders. Dialogs use white surfaces, readable secondary text and a translucent charcoal backdrop. Native app icons keep their identifying colors.
