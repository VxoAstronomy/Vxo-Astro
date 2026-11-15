const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': 'true',
};

export const IconCart = (p) => (
  <svg {...base} {...p}>
    <path d="M3.5 5h2.1l1.9 10.2a1.6 1.6 0 0 0 1.6 1.3h7.6a1.6 1.6 0 0 0 1.6-1.2L20 8H6.4" />
    <circle cx="9.5" cy="20" r="1.15" />
    <circle cx="17" cy="20" r="1.15" />
  </svg>
);

export const IconSearch = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const IconClose = (p) => (
  <svg {...base} {...p}>
    <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
  </svg>
);

export const IconArrowRight = (p) => (
  <svg {...base} {...p}>
    <path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5" />
  </svg>
);

export const IconArrowUpRight = (p) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </svg>
);

export const IconArrowLeft = (p) => (
  <svg {...base} {...p}>
    <path d="M20 12H5M10.5 6.5 4 12l6.5 5.5" />
  </svg>
);

export const IconChevronDown = (p) => (
  <svg {...base} {...p}>
    <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
  </svg>
);

export const IconChevronLeft = (p) => (
  <svg {...base} {...p}>
    <path d="m14.5 6-6 6 6 6" />
  </svg>
);

export const IconChevronRight = (p) => (
  <svg {...base} {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);

export const IconPlus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const IconCheck = (p) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const IconChat = (p) => (
  <svg {...base} {...p}>
    <path d="M4 5.6h16v10.1H8.7L4 19.6V5.6Z" />
    <path d="M8 9.4h8M8 12.4h5" />
  </svg>
);

export const IconZoom = (p) => (
  <svg {...base} {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15 15 4.5 4.5M8 10.5h5M10.5 8v5" />
  </svg>
);

export const IconCopy = (p) => (
  <svg {...base} {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.2" />
    <path d="M15.5 8.5v-2A2.5 2.5 0 0 0 13 4H6.5A2.5 2.5 0 0 0 4 6.5V13a2.5 2.5 0 0 0 2.5 2.5h2" />
  </svg>
);

export const IconPhone = (p) => (
  <svg {...base} {...p}>
    <path d="M7.2 3.8h-2A2.2 2.2 0 0 0 3 6.2c.2 7.6 6.2 13.6 13.8 13.8a2.2 2.2 0 0 0 2.4-2.2v-2a1.8 1.8 0 0 0-1.5-1.8l-2.3-.5a1.8 1.8 0 0 0-1.7.6l-.8.9a13.6 13.6 0 0 1-4.4-4.4l.9-.8a1.8 1.8 0 0 0 .6-1.7l-.5-2.3a1.8 1.8 0 0 0-1.8-1.5Z" />
  </svg>
);

export const IconMail = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const IconPin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s6.5-5.7 6.5-10.4a6.5 6.5 0 1 0-13 0C5.5 15.3 12 21 12 21Z" />
    <circle cx="12" cy="10.4" r="2.3" />
  </svg>
);

export const IconClock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </svg>
);

export const IconTrash = (p) => (
  <svg {...base} {...p}>
    <path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.2h9.4L17.5 7M10 11v4.5M14 11v4.5" />
  </svg>
);

export const IconMenu = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const IconSparkle = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.5c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.6 5.9-2.2 6.5-6.5Z" />
    <path d="M18.5 15.5c.3 1.9 1 2.6 2.9 2.9-1.9.3-2.6 1-2.9 2.9-.3-1.9-1-2.6-2.9-2.9 1.9-.3 2.6-1 2.9-2.9Z" />
  </svg>
);

export const IconShield = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.5 19 6v5.4c0 4.4-2.9 7.6-7 9.1-4.1-1.5-7-4.7-7-9.1V6l7-2.5Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </svg>
);

export const IconTruck = (p) => (
  <svg {...base} {...p}>
    <path d="M3 6.5h10.5v10H3zM13.5 10H18l3 3.2v3.3h-7.5" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const IconTelescope = (p) => (
  <svg {...base} {...p}>
    <path d="m4 13 12.6-7.4 2.4 4.1L6.4 17 4 13Z" />
    <path d="m9.5 14.8-2 6M14 7.2l2.4 4.1M11.5 19h4" />
  </svg>
);

export const IconLayers = (p) => (
  <svg {...base} {...p}>
    <path d="m12 3.5 8.5 4.6L12 12.7 3.5 8.1 12 3.5Z" />
    <path d="m4 12.5 8 4.3 8-4.3M4 16.5 12 21l8-4.5" />
  </svg>
);

export const IconWrench = (p) => (
  <svg {...base} {...p}>
    <path d="M14.7 6.2a4.6 4.6 0 0 0-6 6L4 17l3 3 4.8-4.7a4.6 4.6 0 0 0 6-6l-2.8 2.8-2.6-.4-.4-2.6 2.7-2.9Z" />
  </svg>
);

export const IconFacebook = (p) => (
  <svg {...base} {...p}>
    <path d="M14.5 8.5H17V5h-2.5A4.5 4.5 0 0 0 10 9.5V12H7.5v3.5H10V21h3.5v-5.5H16l.7-3.5h-3.2V9.7c0-.8.3-1.2 1-1.2Z" />
  </svg>
);

export const IconInstagram = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconYoutube = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="6" width="18" height="12" rx="3.4" />
    <path d="m10.5 9.5 4.3 2.5-4.3 2.5v-5Z" />
  </svg>
);

export const IconStar = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2.8l1.8 6.1 6.2.2-5 3.7 1.8 6-4.8-3.7-4.8 3.7 1.8-6-5-3.7 6.2-.2L12 2.8Z" />
  </svg>
);
