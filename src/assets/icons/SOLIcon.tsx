import React, { FC } from 'react'

import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg'

export const SOLIcon: FC<SvgProps> = (props) => {
  const { width, height } = props
  return (
    <Svg
      viewBox="0 0 26 26"
      width={width}
      height={height}
      fill="none"
      {...props}
    >
      <Path
        d="M7.549 15.554a.563.563 0 01.398-.165h13.747c.251 0 .377.304.2.481l-2.716 2.716a.563.563 0 01-.399.164H5.032a.281.281 0 01-.199-.48l2.716-2.716z"
        fill="url(#prefix__paint0_linear_1_25)"
      />
      <Path
        d="M7.549 5.415a.58.58 0 01.398-.165h13.747c.252 0 .377.303.2.48l-2.716 2.716a.563.563 0 01-.399.165H5.033a.282.282 0 01-.2-.48L7.55 5.414z"
        fill="url(#prefix__paint1_linear_1_25)"
      />
      <Path
        d="M19.178 10.452a.564.564 0 00-.399-.165H5.032a.282.282 0 00-.199.481l2.716 2.716a.564.564 0 00.398.164h13.747a.281.281 0 00.2-.48l-2.716-2.716z"
        fill="url(#prefix__paint2_linear_1_25)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear_1_25"
          x1={-26.32}
          y1={2.7}
          x2={-26.686}
          y2={21.105}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#00FFA3" />
          <Stop offset={1} stopColor="#DC1FFF" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint1_linear_1_25"
          x1={-30.48}
          y1={0.528}
          x2={-30.846}
          y2={18.933}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#00FFA3" />
          <Stop offset={1} stopColor="#DC1FFF" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint2_linear_1_25"
          x1={-28.414}
          y1={1.607}
          x2={-28.779}
          y2={20.012}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#00FFA3" />
          <Stop offset={1} stopColor="#DC1FFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}
