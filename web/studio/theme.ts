import {buildLegacyTheme} from 'sanity'

// Aligned with mukoko registry design tokens
const tokens = {
  tanzanite: '#B388FF',
  cobalt: '#0047AB',
  malachite: '#64FFDA',
  gold: '#FFD740',
  terracotta: '#D4A574',
  background: '#FAF9F5',
  foreground: '#141413',
  mutedForeground: '#5C5B58',
  destructive: '#B3261E',
  success: '#004D40',
  warning: '#7A5C00',
}

export const mukokoTheme = buildLegacyTheme({
  '--black': tokens.foreground,
  '--white': tokens.background,

  '--gray': tokens.mutedForeground,
  '--gray-base': tokens.mutedForeground,

  '--component-bg': tokens.background,
  '--component-text-color': tokens.foreground,

  '--brand-primary': tokens.cobalt,

  '--default-button-color': tokens.mutedForeground,
  '--default-button-primary-color': tokens.cobalt,
  '--default-button-success-color': tokens.success,
  '--default-button-warning-color': tokens.warning,
  '--default-button-danger-color': tokens.destructive,

  '--state-info-color': tokens.cobalt,
  '--state-success-color': tokens.success,
  '--state-warning-color': tokens.warning,
  '--state-danger-color': tokens.destructive,

  '--main-navigation-color': tokens.foreground,
  '--main-navigation-color--inverted': tokens.background,

  '--focus-color': tokens.cobalt,
})
