import React from 'react'

import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from 'react-native-svg'

export const VietnamFlagIcon = ({ ...props }: SvgProps) => {
  return (
    <Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
      <G clip-path="url(#clip0_786_4593)">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M-10.6816 -0.454468H50.682V40.4546H-10.6816V-0.454468Z"
          fill="#DA251D"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M27.479 29.9877L20.32 24.6583L13.2088 30.0356L15.8455 21.2785L8.73438 15.8692L17.5314 15.7893L20.264 7.04822L23.0366 15.7654L31.8336 15.7734L24.7624 21.2386L27.4711 29.9957L27.479 29.9877Z"
          fill="#FFFF00"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_786_4593">
          <Rect
            width="54.5455"
            height="40.9091"
            fill="white"
            transform="translate(-7.27344 -0.454529)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
