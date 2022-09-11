import React from 'react'

import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from 'react-native-svg'

export const UKFlagIcon = ({ ...props }: SvgProps) => {
  return (
    <Svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
      <G clip-path="url(#clip0_229_5789)">
        <G clip-path="url(#clip1_229_5789)">
          <Path
            d="M-7.27344 -0.454529H47.272V40.4546H-7.27344V-0.454529Z"
            fill="#012169"
          />
          <Path
            d="M-0.881392 -0.454529L19.9141 14.9716L40.6243 -0.454529H47.272V4.82956L26.8175 20.0852L47.272 35.2557V40.4546H40.4538L19.9993 25.1989L-0.370028 40.4546H-7.27344V35.3409L13.0959 20.1705L-7.27344 5.00002V-0.454529H-0.881392Z"
            fill="white"
          />
          <Path
            d="M28.8629 23.4943L47.272 37.0455V40.4546L24.1754 23.4943H28.8629ZM13.1811 25.1989L13.6925 28.1818L-2.67116 40.4546H-7.27344L13.1811 25.1989ZM47.272 -0.454529V-0.198847L26.0504 15.8239L26.2209 12.0739L43.0107 -0.454529H47.272ZM-7.27344 -0.454529L13.0959 14.5455H7.98224L-7.27344 3.12502V-0.454529Z"
            fill="#C8102E"
          />
          <Path
            d="M13.2663 -0.454529V40.4546H26.9027V-0.454529H13.2663ZM-7.27344 13.1818V26.8182H47.272V13.1818H-7.27344Z"
            fill="white"
          />
          <Path
            d="M-7.27344 15.9943V24.1762H47.272V15.9943H-7.27344ZM15.9936 -0.454529V40.4546H24.1754V-0.454529H15.9936Z"
            fill="#C8102E"
          />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_229_5789">
          <Rect width="40" height="40" rx="20" fill="white" />
        </ClipPath>
        <ClipPath id="clip1_229_5789">
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
