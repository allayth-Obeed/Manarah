// Official color palette of the Syrian Arab Republic's visual identity
// (visual-identity.momc.gov.sy). Every color below is derived from this
// palette so it stays the single source of truth for the app's theming.
export const syrianIdentityPalette = {
  charcoal: { light: '#FFFFFF', mid: '#3D3A3B', dark: '#161616' },
  deepUmber: { light: '#6B1F2A', mid: '#4A151E', dark: '#260F14' },
  goldenWheat: { light: '#EDEBE0', mid: '#B9A779', dark: '#988561' },
  forest: { light: '#428177', mid: '#054239', dark: '#002623' },
}

function hexToRgb(hex) {
  const value = parseInt(hex.replace('#', ''), 16)
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 }
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`
}

// Blends two hex colors so derived tints/shades stay traceable to the palette above.
function mix(hexA, hexB, ratio) {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  return rgbToHex({
    r: a.r + (b.r - a.r) * ratio,
    g: a.g + (b.g - a.g) * ratio,
    b: a.b + (b.b - a.b) * ratio,
  })
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Public helper so components can derive a transparent variant of any theme color
// instead of hardcoding their own rgba() triples.
export function withAlpha(hex, alpha) {
  return rgba(hex, alpha)
}

const P = syrianIdentityPalette

export const themeTokens = {
  light: {
    mode: 'light',
    colors: {
      // Golden Wheat tinted over white — warm neutral background layers.
      background: mix(P.charcoal.light, P.goldenWheat.light, 0.35),
      pageBg: mix(P.charcoal.light, P.goldenWheat.light, 0.55),
      surface: P.charcoal.light,
      panelBg: mix(P.charcoal.light, P.goldenWheat.light, 0.15),
      text: P.charcoal.dark,
      mutedText: mix(P.charcoal.mid, P.charcoal.light, 0.35),
      border: mix(P.charcoal.mid, P.charcoal.light, 0.75),
      borderLight: mix(P.goldenWheat.light, P.charcoal.light, 0.4),
      // Forest — primary brand color for buttons and focus states.
      primary: P.forest.mid,
      primaryDark: P.forest.dark,
      onPrimary: P.charcoal.light,
      onPrimaryMuted: rgba(P.charcoal.light, 0.82),
      onSecondary: P.forest.dark,
      // Golden Wheat — secondary accent color for highlights.
      secondary: P.goldenWheat.mid,
      accent: P.goldenWheat.light,
      dateBg: P.goldenWheat.light,
      bgelem: mix(P.forest.light, P.charcoal.light, 0.85),
      btn: mix(P.charcoal.mid, P.charcoal.light, 0.9),
      // Deep Umber — the identity's alert/destructive color family.
      danger100: mix(P.deepUmber.light, P.charcoal.light, 0.92),
      danger300: mix(P.deepUmber.light, P.charcoal.light, 0.82),
      danger500: P.deepUmber.light,
      danger700: P.deepUmber.mid,
    },
    layout: {
      sidebarBg: P.charcoal.light,
      sidebarBorder: mix(P.charcoal.mid, P.charcoal.light, 0.85),
      navInactive: mix(P.charcoal.mid, P.charcoal.light, 0.35),
      navActiveBg: P.goldenWheat.light,
      navHoverBg: mix(P.goldenWheat.light, P.charcoal.light, 0.5),
      navActiveText: P.forest.mid,
      navActiveBorder: P.goldenWheat.mid,
      subTitle: mix(P.charcoal.mid, P.charcoal.light, 0.45),
      danger: P.deepUmber.light,
      logoText: P.forest.mid,
      searchBorder: rgba(P.charcoal.dark, 0.15),
      searchHoverBg: rgba(P.charcoal.dark, 0.04),
      searchBaseBg: rgba(P.charcoal.dark, 0.02),
    },
    fontFamily: {
      arabic: ['"Qomra Arabic"', '"IBM Plex Sans Arabic"', 'sans-serif'],
    },
  },
  dark: {
    mode: 'dark',
    colors: {
      background: '#0B1220',
      pageBg: '#07121A',
      surface: '#111827',
      panelBg: '#0B1620',
      // Lightened beyond the original #F8FAFC for better readability on very dark surfaces.
      text: '#FFFFFF',
      // Lightened beyond the original #94A3B8 for better readability on very dark surfaces.
      mutedText: '#B4BFCD',
      onPrimary: '#FFFFFF',
      onPrimaryMuted: 'rgba(255, 255, 255, 0.84)',
      border: '#334155',
      borderLight: '#1F2A37',
      // Forest — primary brand color for buttons and focus states.
      primaryDark: P.forest.dark,
      primary: P.forest.mid,
      // Golden Wheat — secondary accent color for highlights.
      secondary: P.goldenWheat.mid,
      onSecondary: P.forest.dark,
      accent: '#1E293B',
      dateBg: '#0E1A26',
      bgelem: '#1A1A1A',
      btn: '#2C2C2C',
      danger100: '#2B0B0B',
      danger300: '#4C0F0F',
      danger500: '#F87171',
      danger700: '#B91C1C',
    },
    layout: {
      sidebarBg: '#111827',
      sidebarBorder: '#334155',
      navInactive: '#CBD5E1',
      navActiveBg: 'rgba(148, 163, 184, 0.16)',
      navHoverBg: 'rgba(148, 163, 184, 0.12)',
      navActiveText: P.forest.light,
      navActiveBorder: P.goldenWheat.mid,
      // Lightened beyond the original #94A3B8 for better readability on very dark surfaces.
      subTitle: '#B4BFCD',
      danger: '#F87171',
      logoText: P.forest.light,
      searchBorder: '#334155',
      searchHoverBg: 'rgba(148, 163, 184, 0.12)',
      searchBaseBg: 'rgba(148, 163, 184, 0.08)',
    },
    fontFamily: {
      arabic: ['"Qomra Arabic"', '"IBM Plex Sans Arabic"', 'sans-serif'],
    },
  },
}

export default themeTokens
