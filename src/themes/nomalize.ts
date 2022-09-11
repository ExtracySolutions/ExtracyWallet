import { scale, verticalScale, moderateScale } from 'react-native-size-matters'

/**
 * Nomalize font sizes, padding, margin, etc. between different devices
 * @param size: the positive number you want to set for nomalize
 */
export const normalize =
  (size: number) => (type?: 'vertical' | 'horizontal' | 'moderate') => {
    switch (type) {
      case 'horizontal':
        return scale(size)
      case 'vertical':
        return verticalScale(size)
      case 'moderate':
        return moderateScale(size, 0.2)

      default:
        return scale(size)
    }
  }

export type Normalize = typeof normalize
