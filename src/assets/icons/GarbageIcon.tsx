import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const GarbageIcon: FC<SvgProps> = (props) => {
  const { color } = props
  return (
    <Svg width={18} height={18} fill="none" {...props}>
      <Path
        d="M5.734 1.953h-.171a.172.172 0 0 0 .171-.172v.172h6.532v-.172c0 .095.077.172.171.172h-.171V3.5h1.546V1.781c0-.758-.616-1.375-1.374-1.375H5.561c-.758 0-1.375.617-1.375 1.375V3.5h1.547V1.953ZM16.563 3.5H1.438a.687.687 0 0 0-.688.688v.687c0 .095.077.172.172.172H2.22l.53 11.236c.035.733.64 1.31 1.373 1.31h9.754c.735 0 1.338-.575 1.373-1.31l.53-11.236h1.298a.172.172 0 0 0 .172-.172v-.688a.687.687 0 0 0-.688-.687Zm-2.851 12.547H4.287l-.52-11h10.463l-.52 11Z"
        fill={color ? color : '#707070'}
      />
    </Svg>
  )
}
