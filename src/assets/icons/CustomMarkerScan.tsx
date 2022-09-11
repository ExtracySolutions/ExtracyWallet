import React, { FC } from 'react'

const originalWidth = 375,
  originalHeight = 643
import Svg, { SvgProps, Path, G } from 'react-native-svg'

export const CustomMarkerScan: FC<SvgProps> = (props) => {
  return (
    <Svg
      viewBox={`0 0 ${originalWidth} ${originalHeight}`}
      fill="none"
      preserveAspectRatio="xMidYMin slice"
      {...props}
    >
      <G fill="none" fillRule="evenodd">
        <Path
          // scale={SCREEN_WIDTH / 375}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M375 0H0v643h375V0ZM92 190c-13.255 0-24 10.745-24 24v192c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V214c0-13.255-10.745-24-24-24H92Z"
          fill="#000"
          fillOpacity={0.3}
        />
        <Path
          // scale={SCREEN_WIDTH / 375}
          d="M308 250v-36c0-13.255-10.745-24-24-24h-36m60 180v36c0 13.255-10.745 24-24 24h-36M128 190H92c-13.255 0-24 10.745-24 24v36m0 120v36c0 13.255 10.745 24 24 24h36"
          stroke="#fff"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  )
}
