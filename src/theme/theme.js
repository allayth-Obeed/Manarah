export const themeTokens = {
  light: {
    mode: 'light',
    colors: {
      background: '#F8F9FA', // Use for the main page background.
      surface: '#FFFFFF', // Use for cards, panels, and raised surfaces.
      text: '#0F172A', // Use for primary readable text.
      mutedText: '#475569', // Use for supporting or less important text.
      border: '#E2E8F0', // Use for separators, outlines, and dividers.
      primary: '#006747', // Use for main brand actions and emphasis.
      secondary: '#C5A059', // Use for secondary accents and highlights.
      accent: '#F5F5DC', // Use for subtle decorative backgrounds or accents.
    },
    layout: {
      sidebarBg: '#FFFFFF', // Use for the sidebar background in light mode.
      sidebarBorder: '#E6EBEF', // Use for the sidebar edge or divider.
      navInactive: '#7C879B', // Use for navigation items that are not selected.
      navActiveBg: '#ECEFEE', // Use for the active navigation item's background.
      navHoverBg: '#F5F7F8', // Use for navigation item hover states.
      navActiveText: '#006747', // Use for the active navigation item's text.
      navActiveBorder: '#C39D57', // Use for the active item indicator or border.
      subTitle: '#9AA3B2', // Use for subtitle or helper text.
      danger: '#D64040', // Use for errors, warnings, or destructive actions.
      dangerSoft: '#F87171', // Use for lighter danger states or soft alerts.
      logoText: '#006747', // Use for the logo text color.
      searchBg: '#F5F7FA', // Use for the search input background.
      searchBorder: 'rgba(0, 0, 0, 0.15)', // Use for the search input border.
      searchHoverBg: 'rgba(0, 0, 0, 0.04)', // Use for search hover feedback.
      searchBaseBg: 'rgba(0, 0, 0, 0.02)', // Use for the default search field base.
    },
    fontFamily: {
      arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'],
    },
  },
  dark: {
    mode: 'dark',
    colors: {
      background: '#0B1220', // Use for the main page background in dark mode.
      surface: '#111827', // Use for cards, panels, and elevated surfaces in dark mode.
      text: '#F8FAFC', // Use for primary readable text in dark mode.
      mutedText: '#CBD5E1', // Use for supporting text in dark mode.
      border: '#334155', // Use for separators, outlines, and dividers in dark mode.
      primary: '#4ADE80', // Use for main brand actions and emphasis in dark mode.
      secondary: '#EAB308', // Use for secondary accents and highlights in dark mode.
      accent: '#1E293B', // Use for subtle decorative backgrounds or accents in dark mode.
    },
    layout: {
      sidebarBg: '#111827', // Use for the sidebar background in dark mode.
      sidebarBorder: '#334155', // Use for the sidebar edge or divider in dark mode.
      navInactive: '#CBD5E1', // Use for navigation items that are not selected in dark mode.
      navActiveBg: 'rgba(148, 163, 184, 0.16)', // Use for the active navigation item's background in dark mode.
      navHoverBg: 'rgba(148, 163, 184, 0.12)', // Use for navigation item hover states in dark mode.
      navActiveText: '#4ADE80', // Use for the active navigation item's text in dark mode.
      navActiveBorder: '#EAB308', // Use for the active item indicator or border in dark mode.
      subTitle: '#94A3B8', // Use for subtitle or helper text in dark mode.
      danger: '#F87171', // Use for errors, warnings, or destructive actions in dark mode.
      dangerSoft: '#F87171', // Use for lighter danger states or soft alerts in dark mode.
      logoText: '#4ADE80', // Use for the logo text color in dark mode.
      searchBg: 'rgba(148, 163, 184, 0.08)', // Use for the search input background in dark mode.
      searchBorder: '#334155', // Use for the search input border in dark mode.
      searchHoverBg: 'rgba(148, 163, 184, 0.12)', // Use for search hover feedback in dark mode.
      searchBaseBg: 'rgba(148, 163, 184, 0.08)', // Use for the default search field base in dark mode.
    },
    fontFamily: {
      arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'],
    },
  },
};

export default themeTokens;
