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
      // MODIFIED: تغميق إضافي بناءً على الطلب — الأخضر الداكن أصبح هو الأساسي ليطابق عمق الهوية الرسمية
      // Primary brand color for buttons and focus states. (الأخضر الداكن - Forest)
      primary: '#054239',
      // A darker primary used in some UI elements (closer to design) (الأخضر العميق جداً - Forest)
      primaryDark: '#002623',
      // Text color used on primary backgrounds (buttons/cards)
      onPrimary: '#FFFFFF',
      // Softer text on primary backgrounds.
      onPrimaryMuted: 'rgba(255, 255, 255, 0.82)',
      // MODIFIED: الأخضر العميق جداً من الهوية بدل الأسود الملاحي العام — يوحّد لون النص فوق الذهبي مع هوية اللونين
      // Text color used on secondary backgrounds (الأخضر العميق جداً - Forest)
      onSecondary: '#002623',
      // MODIFIED: لوحة القمح الذهبي (Golden Wheat) للذهبي الثانوي
      // Secondary accent color for highlights. (الذهبي المتوسط - Golden Wheat)
      secondary: '#B9A779',
      // Soft accent background for small emphasis areas. (البيج الفاتح - Golden Wheat)
      accent: '#EDEBE0',
      // Date box / small emphasis background (البيج الفاتح - Golden Wheat)
      dateBg: '#EDEBE0',
      // Element background used in filter bars and similar blocks.
      bgelem: '#F1F4F2',
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
      navActiveBg: ' #CFE2F9',
      // Hover background for navigation items.
      navHoverBg: '#F5F7F8',
      // MODIFIED: تغميق إضافي — نفس الأخضر الداكن الأساسي الجديد (خلفية فاتحة هنا فالتباين لا يزال ممتازاً)
      // Active navigation item text color.
      navActiveText: '#054239',
      // MODIFIED: الذهبي المتوسط من لوحة القمح الذهبي
      // Active navigation item border color.
      navActiveBorder: '#B9A779',
      // Subtitle and helper text color.
      subTitle: '#9AA3B2',
      // Danger and destructive action color.
      danger: '#D64040',
      // MODIFIED: تغميق إضافي — نفس الأخضر الداكن الأساسي الجديد
      // Logo text color.
      logoText: '#054239',
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
      // MODIFIED: تغميق إضافي بناءً على الطلب — الأخضر العميق جداً كأقصى تدرّج (الوضع الليلي أصلاً داكن)
      // A darker primary used in some UI elements (الأخضر العميق جداً - Forest)
      primaryDark: '#002623',
      // MODIFIED: الأخضر الداكن هو الأساسي الآن ليطابق عمق الهوية الرسمية (يبقى واضحاً فوق النص الأبيض بالأزرار)
      // Primary brand color for buttons and focus states. (الأخضر الداكن - Forest)
      primary: '#054239',
      // MODIFIED: لوحة القمح الذهبي (Golden Wheat) للذهبي الثانوي
      // Secondary accent color for highlights. (الذهبي المتوسط - Golden Wheat)
      secondary: '#B9A779',
      // MODIFIED: الأخضر العميق جداً من الهوية بدل الأسود الملاحي العام
      // Text color used on secondary backgrounds in dark mode (الأخضر العميق جداً - Forest)
      onSecondary: '#002623',
      // Soft accent background for small emphasis areas.
      accent: '#1E293B',
      // Date box / small emphasis background
      dateBg: '#0E1A26',
      // Element background used in filter bars and similar blocks.
      bgelem: '#1A1A1A',
      // Button background color for dark controls.
      btn: '#2C2C2C',
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
      // ملاحظة: أُبقي على الأخضر الفاتح (#428177) هنا فقط دون تغميق أكثر — النص/الأيقونة على خلفية داكنة
      // جداً (#111827)، والتغميق الإضافي (#054239) يفقد الوضوح والتباين المطلوب لقراءة عنصر القائمة النشط
      // Active navigation item text color.
      navActiveText: '#428177',
      // MODIFIED: الذهبي المتوسط من لوحة القمح الذهبي
      // Active navigation item border color.
      navActiveBorder: '#B9A779',
      // Subtitle and helper text color.
      subTitle: '#94A3B8',
      // Danger and destructive action color.
      danger: '#F87171',
      // ملاحظة: نفس سبب navActiveText أعلاه — الإبقاء على الدرجة الأفتح لضمان وضوح الشعار بالوضع الليلي
      // Logo text color.
      logoText: '#428177',
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
