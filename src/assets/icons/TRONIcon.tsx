import React, { FC } from 'react'

import Svg, { SvgProps, Path } from 'react-native-svg'

export const TRONIcon: FC<SvgProps> = (props) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.766 8.479c-.444-.41-.958-.909-1.494-1.43-.752-.73-1.548-1.502-2.25-2.125l-.07-.05a1.358 1.358 0 00-.395-.22l-.542-.101C15.277 3.855 3.163 1.595 2.914 1.625a.498.498 0 00-.206.079l-.068.053a.793.793 0 00-.185.298l-.018.047v.292c.823 2.29 2.96 7.404 4.932 12.127 1.668 3.992 3.219 7.705 3.76 9.193.071.221.206.64.458.661h.057c.135 0 .711-.76.711-.76S22.649 11.13 23.691 9.8c.135-.164.254-.34.355-.526a.857.857 0 00-.28-.796zm-8.77 1.454l4.394-3.644 2.577 2.375-6.97 1.269zm-9.27-6.438l7.564 6.2 4.674-3.943L5.726 3.495zm8.246 7.824l7.743-1.248-8.852 10.664 1.11-9.416zm-1.315-.452L4.698 4.114l6.807 16.628 1.152-9.875z"
        fill="#FC070C"
      />
    </Svg>
  )
}
