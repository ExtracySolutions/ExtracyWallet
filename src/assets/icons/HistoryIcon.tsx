import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const HistoryIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 24 24"
      width={17}
      height={17}
      fill={'none'}
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.052 8.3C4.564 4.157 8.539 1.2 13.2 1.2 19.16 1.2 24 6.04 24 12A10.8 10.8 0 0 1 3.847 17.4a1.2 1.2 0 0 1 2.077-1.202 8.401 8.401 0 0 0 7.276 4.2c4.636 0 8.4-3.764 8.4-8.4 0-4.636-3.764-8.4-8.4-8.4-3.86 0-7.116 2.61-8.097 6.16l2.102-1.2a1.2 1.2 0 1 1 1.19 2.083l-4.2 2.4a1.201 1.201 0 0 1-1.663-.494l-2.4-4.685A1.2 1.2 0 0 1 2.268 6.77l.784 1.53ZM14.4 11.502l3.248 3.248a1.2 1.2 0 0 1-1.696 1.697l-3.6-3.6A1.199 1.199 0 0 1 12 12V7.2a1.2 1.2 0 0 1 2.4 0v4.303Z"
        fill={color ?? '#556EFA'}
      />
    </Svg>
  )
}
