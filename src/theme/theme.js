export const themeTokens = {
  light: {
    mode: 'light',
    colors: {
      // Page background.
      background: '#F8F9FA',
      // Project-specific page background (used in MainAssignment layout)
      pageBg: '#F5F2EB',
      // Surface color for cards and panels.
      surface: '#FFFFFF',
      // Panel background used for event list card.
      panelBg: '#F7F6F3',
      // Main readable text color.
      text: '#0F172A',
      // Muted text for hints and secondary copy.
      mutedText: '#64748B',
      // Borders and dividers.
      border: '#E2E8F0',
      // Lighter border used in panels
      borderLight: '#E7E3DC',
      // Primary brand color for buttons and focus states.
      primary: '#006747',
      // A darker primary used in some UI elements (closer to design)
      primaryDark: '#0D5B3E',
      // Text color used on primary backgrounds (buttons/cards)
      onPrimary: '#FFFFFF',
      // Softer text on primary backgrounds.
      onPrimaryMuted: 'rgba(255, 255, 255, 0.82)',
      // Text color used on secondary backgrounds
      onSecondary: '#0F172A',
      // Secondary accent color for highlights.
      secondary: '#C5A059',
      // Soft accent background for small emphasis areas.
      accent: '#F5F5DC',
      // Date box / small emphasis background
      dateBg: '#F5EBD3',
      // Element background used in filter bars and similar blocks.
      bgelem: '#B0B0B0',
      // Button background color for light controls.
      btn: '#F3F4F6',
      // Danger colors (new shades taken from provided design)
      danger100: '#FFF3F3',
      danger300: '#FCE7E7',
      danger500: '#DC2626',
      danger700: '#B91C1C',
    },
    layout: {
      // Sidebar background.
      sidebarBg: '#FFFFFF',
      // Sidebar border.
      sidebarBorder: '#E6EBEF',
      // Inactive navigation item color.
      navInactive: '#7C879B',
      // Active navigation item background.
      navActiveBg: '#ECEFEE',
      // Hover background for navigation items.
      navHoverBg: '#F5F7F8',
      // Active navigation item text color.
      navActiveText: '#006747',
      // Active navigation item border color.
      navActiveBorder: '#C39D57',
      // Subtitle and helper text color.
      subTitle: '#9AA3B2',
      // Danger and destructive action color.
      danger: '#D64040',
      // Logo text color.
      logoText: '#006747',
      // Search input border.
      searchBorder: 'rgba(0, 0, 0, 0.15)',
      // Search hover background.
      searchHoverBg: 'rgba(0, 0, 0, 0.04)',
      // Default search field background.
      searchBaseBg: 'rgba(0, 0, 0, 0.02)',
    },
    fontFamily: {
      arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'],
    },
  },
  dark: {
    mode: 'dark',
    colors: {
      // Page background.
      background: '#0B1220',
      // Project-specific page background (used in MainAssignment layout)
      pageBg: '#07121A',
      // Surface color for cards and panels.
      surface: '#111827',
      // Panel background used for event list card.
      panelBg: '#0B1620',
      // Main readable text color.
      text: '#F8FAFC',
      // Muted text for hints and secondary copy.
      mutedText: '#94A3B8',
      // Text color to use on primary buttons/cards
      onPrimary: '#FFFFFF',
      // Softer text on primary backgrounds.
      onPrimaryMuted: 'rgba(255, 255, 255, 0.84)',
      // Borders and dividers.
      border: '#334155',
      // Lighter border used in panels
      borderLight: '#1F2A37',
      // A darker primary used in some UI elements
      primaryDark: '#063B2B',
      // Primary brand color for buttons and focus states.
      primary: '#004D34',
      // Secondary accent color for highlights.
      secondary: '#EAB308',
      // Text color used on secondary backgrounds in dark mode
      onSecondary: '#0B1220',
      // Soft accent background for small emphasis areas.
      accent: '#1E293B',
      // Date box / small emphasis background
      dateBg: '#0E1A26',
      // Element background used in filter bars and similar blocks.
      bgelem: '#1A1A1A',
      // Button background color for dark controls.
      btn: '#3E3E3E',
      // Danger colors (dark variants)
      danger100: '#2B0B0B',
      danger300: '#4C0F0F',
      danger500: '#F87171',
      danger700: '#B91C1C',
    },
    layout: {
      // Sidebar background.
      sidebarBg: '#111827',
      // Sidebar border.
      sidebarBorder: '#334155',
      // Inactive navigation item color.
      navInactive: '#CBD5E1',
      // Active navigation item background.
      navActiveBg: 'rgba(148, 163, 184, 0.16)',
      // Hover background for navigation items.
      navHoverBg: 'rgba(148, 163, 184, 0.12)',
      // Active navigation item text color.
      navActiveText: '#4ADE80',
      // Active navigation item border color.
      navActiveBorder: '#EAB308',
      // Subtitle and helper text color.
      subTitle: '#94A3B8',
      // Danger and destructive action color.
      danger: '#F87171',
      // Logo text color.
      logoText: '#4ADE80',
      // Search input border.
      searchBorder: '#334155',
      // Search hover background.
      searchHoverBg: 'rgba(148, 163, 184, 0.12)',
      // Default search field background.
      searchBaseBg: 'rgba(148, 163, 184, 0.08)',
    },
    fontFamily: {
      arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'],
    },
  },
}

export default themeTokens
