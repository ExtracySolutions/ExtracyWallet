import React, { FC } from 'react'

import Svg, {
  SvgProps,
  Path,
  Circle,
  G,
  Defs,
  ClipPath,
} from 'react-native-svg'

export const SwapIconFailed: FC<SvgProps> = (props) => {
  return (
    <Svg
      preserveAspectRatio="xMaxYMid meet"
      viewBox="0 0 38 38"
      width={38}
      height={38}
      fill="none"
      {...props}
    >
      <Circle opacity={0.1} cx={19} cy={19} r={19} fill="#F15223" />
      <G clipPath="url(#a)">
        <Path
          d="M22.733 14.77v-.1h-7.907c-.8 0-1.447.649-1.447 1.452v2.994a.158.158 0 0 1-.159.158h-1.924c-.087 0-.158-.067-.158-.166v-2.994a3.69 3.69 0 0 1 3.684-3.699H22.732V10.29c0-.13.152-.203.252-.123l4.14 3.252.002.001a.157.157 0 0 1 0 .248h-.001l-4.14 3.253h-.001a.155.155 0 0 1-.252-.123v-2.026Zm-11.534 9.645c-.084-.064-.079-.185-.004-.238l.004-.003 4.14-3.252a.155.155 0 0 1 .252.122V23.171h7.903c.8 0 1.447-.649 1.447-1.451v-2.995c0-.088.072-.158.158-.158h1.924c.089 0 .159.072.159.158v2.994a3.69 3.69 0 0 1-3.684 3.7H15.59v2.126c0 .13-.151.203-.251.123l-4.141-3.253Z"
          fill="#F15223"
          stroke="#F15223"
          strokeWidth={0.2}
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path
            fill="#fff"
            transform="translate(11 10)"
            d="M0 0h16.319v17.837H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
