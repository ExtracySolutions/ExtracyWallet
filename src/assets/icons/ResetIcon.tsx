import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const ResetIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width={16} height={16} fill="none" {...props}>
      <Path
        d="M7.612 2.242a.542.542 0 0 1 0 .766l-.7.7h.859c2.52 0 4.604 2.085 4.604 4.605 0 2.52-2.084 4.604-4.604 4.604s-4.604-2.084-4.604-4.604a.542.542 0 1 1 1.083 0c0 1.921 1.6 3.52 3.52 3.52 1.922 0 3.522-1.599 3.522-3.52 0-1.922-1.6-3.521-3.521-3.521h-.86l.701.7a.542.542 0 0 1-.766.766L5.221 4.633a.542.542 0 0 1 0-.766l1.625-1.625a.542.542 0 0 1 .766 0Z"
        fill="#B9B9BD"
      />
    </Svg>
  )
}
