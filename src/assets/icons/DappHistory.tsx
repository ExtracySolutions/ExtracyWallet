import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const DappHistoryIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={30} height={30} fill="none" {...props}>
      <Path
        d="M5.794 11.25h4.519a.938.938 0 0 0 0-1.874H7.5a9.375 9.375 0 1 1-1.838 6.478.937.937 0 1 0-1.865.169 11.25 11.25 0 1 0 2.765-8.466V5.626a.937.937 0 1 0-1.875 0v4.687a.937.937 0 0 0 .938.938h.169Zm8.268-1.874a.937.937 0 0 1 .938.937v4.688h2.813a.937.937 0 1 1 0 1.875h-3.75a.937.937 0 0 1-.938-.938v-5.625a.938.938 0 0 1 .938-.937Z"
        fill="#BABABA"
      />
    </Svg>
  )
}
