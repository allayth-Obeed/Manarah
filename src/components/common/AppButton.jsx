import React from 'react'
import { Button } from '@mui/material'
import { useTheme } from '../../theme/themeContext'

function resolveIcon(icon, iconColor, iconSize) {
  if (!React.isValidElement(icon)) {
    return icon
  }

  const existingSx = icon.props?.sx || {}

  return React.cloneElement(icon, {
    sx: {
      ...existingSx,
      color: iconColor ?? existingSx.color,
      fontSize: iconSize ?? existingSx.fontSize,
    },
  })
}

export default function AppButton({
  children,
  icon,
  iconColor,
  iconPosition = 'start',
  iconSize = 18,
  backgroundColor,
  borderColor,
  borderRadius = 2,
  dir,
  fullWidth,
  fontSize = 14,
  fontWeight = 700,
  height,
  hoverBackgroundColor,
  hoverTextColor,
  minWidth = 0,
  px = 2,
  py = 0.8,
  textColor,
  variant = 'contained',
  width,
  sx,
  ...props
}) {
  const { activeTheme } = useTheme()

  const resolvedBackgroundColor =
    backgroundColor ?? (variant === 'outlined' ? 'transparent' : activeTheme.colors.primary)
  const resolvedTextColor = textColor ?? activeTheme.colors.onPrimary
  const resolvedBorderColor = borderColor ?? resolvedBackgroundColor
  const resolvedHoverBackgroundColor = hoverBackgroundColor ?? resolvedBackgroundColor
  const resolvedHoverTextColor = hoverTextColor ?? resolvedTextColor
  const resolvedIcon = resolveIcon(icon, iconColor ?? resolvedTextColor, iconSize)

  return (
    <Button
      dir={dir}
      fullWidth={fullWidth}
      variant={variant}
      startIcon={iconPosition === 'start' ? resolvedIcon : undefined}
      endIcon={iconPosition === 'end' ? resolvedIcon : undefined}
      sx={{
        textTransform: 'none',
        borderRadius,
        fontSize,
        fontWeight,
        minWidth,
        width,
        height,
        px,
        py,
        backgroundColor: resolvedBackgroundColor,
        color: resolvedTextColor,
        borderColor: resolvedBorderColor,
        '&:hover': {
          backgroundColor: resolvedHoverBackgroundColor,
          color: resolvedHoverTextColor,
          borderColor: resolvedBorderColor,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
