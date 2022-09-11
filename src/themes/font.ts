import { normalize } from './nomalize'

export type FontSize = {
  /**
   * 36
   */
  h1: number
  /**
   * 32
   */
  h2: number
  /**
   * 30
   */
  h3: number
  /**
   * 26
   */
  h4: number
  /**
   * 22
   */
  h5: number
  /**
   * 20
   */
  h6: number
  /**
   * 18
   */
  title1: number
  /**
   * 16
   */
  title2: number
  /**
   * 14
   */
  body: number
  /**
   * 16
   */
  button: number
  /**
   * 14
   */
  caption1: number
  /**
   * 12
   */
  caption2: number
  /**
   * 10
   */
  label: number

  ///New
  /**
   * 20
   */
  s1: number
  /**
   * 18
   */
  s2: number
  /**
   * 16
   */
  s3: number
  /**
   * 14
   */
  s4: number
  /**
   * 12
   */
  s5: number
}
export type LineHeight = {
  /**
   * 28
   */
  lh1: number
  /**
   * 24
   */
  lh2: number
  /**
   * 20
   */
  lh3: number
  /**
   * 16
   */
  lh4: number
  /**
   * 14
   */
  lh5: number
}

export type Font = {
  size: FontSize
  lineHeight: LineHeight
}

export const font: Font = {
  size: {
    /**
     * 36
     */
    h1: normalize(34)('moderate'),
    /**
     * 32
     */
    h2: normalize(30)('moderate'),
    /**
     * 30
     */
    h3: normalize(28)('moderate'),
    /**
     * 26
     */
    h4: normalize(24)('moderate'),
    /**
     * 22
     */
    h5: normalize(20)('moderate'),
    /**
     * 20
     */
    h6: normalize(18)('moderate'),
    /**
     * 18
     */
    title1: normalize(16)('moderate'),
    /**
     * 16
     */
    title2: normalize(14)('moderate'),
    /**
     * 14
     */
    body: normalize(12)('moderate'),
    /**
     * 16
     */
    button: normalize(14)('moderate'),
    /**
     * 14
     */
    caption1: normalize(12)('moderate'),
    /**
     * 12
     */
    caption2: normalize(10)('moderate'),
    /**
     * 10
     */
    label: normalize(8)('moderate'),

    ///New
    /**
     * 20
     */
    s1: normalize(20)('moderate'),
    /**
     * 18
     */
    s2: normalize(18)('moderate'),
    /**
     * 16
     */
    s3: normalize(16)('moderate'),
    /**
     * 14
     */
    s4: normalize(14)('moderate'),
    /**
     * 12
     */
    s5: normalize(12)('moderate'),
  },

  lineHeight: {
    /**
     * 28
     */
    lh1: normalize(28)('moderate'),
    /**
     * 24
     */
    lh2: normalize(24)('moderate'),
    /**
     * 20
     */
    lh3: normalize(20)('moderate'),
    /**
     * 16
     */
    lh4: normalize(16)('moderate'),
    /**
     * 14
     */
    lh5: normalize(14)('moderate'),
  },
}
