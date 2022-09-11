import React, { FC } from 'react'

import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from 'react-native-svg'

export const OBLWalletIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={65} height={80} viewBox="0 0 65 80" fill="none" {...props}>
      <Path
        d="M.089 1a29.406 29.406 0 0 1 14.468 11.364 30.82 30.82 0 0 1 5.307 18.694c-.044 8.186.06 16.371-.05 24.557a14.865 14.865 0 0 1-5.733-2.55A29.99 29.99 0 0 1 5.343 44.5a30.47 30.47 0 0 1-4.64-11.395A41.702 41.702 0 0 1 0 25.537C.085 17.357-.098 9.17.089 1Z"
        fill="url(#a)"
      />
      <Path
        d="M41.867 12.152c7.34-3.665 14.575-7.567 21.958-11.147.54 5.269-.25 10.59-2.296 15.463a31.161 31.161 0 0 1-9.4 12.392c-3.46 2.731-7.573 4.36-11.409 6.447-2.601 1.423-5.401 2.498-7.86 4.183l-.61 1.1c4.739 2.585 9.61 4.908 14.39 7.407a30.461 30.461 0 0 1 10.518 8.432 31.013 31.013 0 0 1 5.919 12.203 30.084 30.084 0 0 1 .754 10.589c-7.667-3.781-15.254-7.753-22.865-11.658C34.47 64.21 29.378 58.6 26.614 51.758a31.326 31.326 0 0 1-.153-22.887c2.838-7.368 8.352-13.352 15.407-16.719Z"
        fill="url(#b)"
      />
      <Defs>
        <LinearGradient
          id="a"
          x1={9.947}
          y1={1}
          x2={37.183}
          y2={11.011}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#4CEEBC" />
          <Stop offset={1} stopColor="#41C7CB" />
        </LinearGradient>
        <LinearGradient
          id="b"
          x1={44.186}
          y1={1.005}
          x2={93.01}
          y2={25.966}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#4CEEBC" />
          <Stop offset={1} stopColor="#41C7CB" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}
