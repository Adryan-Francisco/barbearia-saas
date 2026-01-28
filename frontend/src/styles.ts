import { CSSProperties } from 'react';

// Color Palette
export const colors = {
  primary: '#6B4C9A', // Purple
  primaryLight: '#8B5FBF',
  primaryDark: '#4A2F6F',
  secondary: '#FF6B6B', // Red/Coral
  success: '#51CF66',
  danger: '#FF6B6B',
  warning: '#FFD93D',
  info: '#4ECDC4',
  dark: '#2C3E50',
  light: '#ECF0F1',
  white: '#FFFFFF',
  gray: '#95A5A6',
  grayLight: '#F8F9FA',
  border: '#E1E8ED',
  darkBg: '#1A1A2E',
};

export const globalStyles: CSSProperties = {
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
};

export const containerStyle: CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '40px 20px',
};

export const authContainerStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  padding: '20px',
  position: 'relative',
  overflow: 'hidden',
};

export const authCardStyle: CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: '16px',
  padding: '50px 40px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  maxWidth: '450px',
  width: '100%',
  position: 'relative',
  zIndex: 1,
};

export const authTitleStyle: CSSProperties = {
  fontSize: '32px',
  fontWeight: '800',
  color: colors.dark,
  marginBottom: '10px',
  textAlign: 'center',
  letterSpacing: '-0.5px',
};

export const authSubtitleStyle: CSSProperties = {
  fontSize: '15px',
  color: colors.gray,
  marginBottom: '35px',
  textAlign: 'center',
  fontWeight: '500',
};

export const formGroupStyle: CSSProperties = {
  marginBottom: '24px',
};

export const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '700',
  color: colors.dark,
  marginBottom: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  fontSize: '15px',
  border: `1.5px solid ${colors.border}`,
  borderRadius: '10px',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit',
  backgroundColor: '#FAFBFC',
};

export const inputFocusStyle: CSSProperties = {
  ...inputStyle,
  borderColor: colors.primary,
  backgroundColor: colors.white,
  boxShadow: `0 0 0 4px ${colors.primary}15`,
  transform: 'translateY(-1px)',
};

export const buttonStyle: CSSProperties = {
  width: '100%',
  padding: '14px 24px',
  backgroundColor: colors.primary,
  color: colors.white,
  border: 'none',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: `0 6px 20px ${colors.primary}35`,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export const buttonHoverStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: colors.primaryLight,
  transform: 'translateY(-2px)',
  boxShadow: `0 8px 28px ${colors.primary}45`,
};

export const buttonSecondaryStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: colors.grayLight,
  color: colors.dark,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  border: `2px solid ${colors.border}`,
};

export const buttonSecondaryHoverStyle: CSSProperties = {
  ...buttonSecondaryStyle,
  backgroundColor: colors.light,
  borderColor: colors.primary,
  color: colors.primary,
};

export const buttonDangerStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: colors.danger,
  boxShadow: `0 6px 20px ${colors.danger}35`,
};

export const buttonDangerHoverStyle: CSSProperties = {
  ...buttonDangerStyle,
  backgroundColor: '#ff5252',
  transform: 'translateY(-2px)',
};

export const buttonSuccessStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: colors.success,
  boxShadow: `0 6px 20px ${colors.success}35`,
};

export const buttonSmallStyle: CSSProperties = {
  padding: '10px 18px',
  fontSize: '13px',
  borderRadius: '8px',
  fontWeight: '600',
};

export const cardStyle: CSSProperties = {
  backgroundColor: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '20px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
};

export const cardHoverStyle: CSSProperties = {
  ...cardStyle,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  transform: 'translateY(-4px)',
  borderColor: colors.primary,
};

export const headerStyle: CSSProperties = {
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
  color: colors.white,
  padding: '24px 20px',
  marginBottom: '40px',
  borderRadius: '0',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const headerTitleStyle: CSSProperties = {
  fontSize: '28px',
  fontWeight: '800',
  margin: 0,
  letterSpacing: '-0.5px',
};

export const headerSubtitleStyle: CSSProperties = {
  fontSize: '14px',
  opacity: 0.85,
  margin: '6px 0 0 0',
  fontWeight: '500',
};

export const errorMessageStyle: CSSProperties = {
  backgroundColor: `${colors.danger}12`,
  color: '#C92A2A',
  padding: '14px 16px',
  borderRadius: '10px',
  marginBottom: '20px',
  fontSize: '14px',
  border: `1.5px solid ${colors.danger}25`,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: '500',
};

export const successMessageStyle: CSSProperties = {
  backgroundColor: `${colors.success}12`,
  color: '#2F9E44',
  padding: '14px 16px',
  borderRadius: '10px',
  marginBottom: '20px',
  fontSize: '14px',
  border: `1.5px solid ${colors.success}25`,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: '500',
};

export const warningMessageStyle: CSSProperties = {
  backgroundColor: `${colors.warning}12`,
  color: '#B8860B',
  padding: '14px 16px',
  borderRadius: '10px',
  marginBottom: '20px',
  fontSize: '14px',
  border: `1.5px solid ${colors.warning}25`,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: '500',
};

export const linkStyle: CSSProperties = {
  color: colors.primary,
  textDecoration: 'none',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '14px',
};

export const linkHoverStyle: CSSProperties = {
  ...linkStyle,
  color: colors.primaryLight,
  textDecoration: 'underline',
};

export const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '24px',
  marginBottom: '24px',
};

export const badgeStyle: CSSProperties = {
  display: 'inline-block',
  padding: '6px 14px',
  borderRadius: '24px',
  fontSize: '12px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
};

export const badgePrimaryStyle: CSSProperties = {
  ...badgeStyle,
  backgroundColor: `${colors.primary}15`,
  color: colors.primary,
};

export const badgeSuccessStyle: CSSProperties = {
  ...badgeStyle,
  backgroundColor: `${colors.success}15`,
  color: '#2F9E44',
};

export const badgeDangerStyle: CSSProperties = {
  ...badgeStyle,
  backgroundColor: `${colors.danger}15`,
  color: '#C92A2A',
};

export const emptyStateStyle: CSSProperties = {
  textAlign: 'center',
  padding: '80px 20px',
  color: colors.gray,
};

export const emptyStateTitleStyle: CSSProperties = {
  fontSize: '22px',
  fontWeight: '700',
  color: colors.dark,
  marginBottom: '12px',
};

export const spinnerStyle: CSSProperties = {
  display: 'inline-block',
  width: '24px',
  height: '24px',
  border: '3px solid rgba(255,255,255,.3)',
  borderRadius: '50%',
  borderTopColor: colors.white,
  animation: 'spin 1s linear infinite',
};
