import React, { FC } from 'react'

import Svg, { Path, SvgProps } from 'react-native-svg'

export const ReloadIcon: FC<SvgProps> = (props) => {
  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        d="M20.1666 10.0837C19.9235 10.0837 19.6904 10.1803 19.5184 10.3522C19.3465 10.5241 19.25 10.7573 19.25 11.0004C19.25 12.6321 18.7661 14.2271 17.8596 15.5838C16.9531 16.9405 15.6646 17.998 14.1571 18.6224C12.6496 19.2468 10.9908 19.4102 9.39047 19.0919C7.79013 18.7735 6.32012 17.9878 5.16633 16.834C4.01255 15.6802 3.22681 14.2102 2.90849 12.6099C2.59016 11.0095 2.75353 9.35073 3.37796 7.84324C4.00238 6.33575 5.0598 5.04728 6.41651 4.14076C7.77321 3.23424 9.36827 2.75038 11 2.75038C12.4205 2.74783 13.8172 3.11626 15.0516 3.81921L14.0185 4.8523C13.8904 4.9805 13.8031 5.14381 13.7678 5.3216C13.7324 5.49939 13.7506 5.68367 13.8199 5.85115C13.8893 6.01862 14.0068 6.16177 14.1575 6.2625C14.3082 6.36323 14.4854 6.41701 14.6666 6.41705H18.3333C18.5764 6.41705 18.8096 6.32047 18.9815 6.14856C19.1534 5.97665 19.25 5.7435 19.25 5.50038V1.83371C19.2499 1.65244 19.1961 1.47525 19.0954 1.32454C18.9947 1.17384 18.8515 1.05637 18.6841 0.98701C18.5166 0.917646 18.3323 0.899493 18.1545 0.934846C17.9767 0.9702 17.8134 1.05747 17.6852 1.18563L16.3918 2.47538C14.7803 1.45146 12.9092 0.910673 11 0.917048C9.00567 0.917048 7.05616 1.50842 5.39796 2.6164C3.73977 3.72437 2.44736 5.29917 1.68418 7.14166C0.920995 8.98414 0.721311 11.0116 1.11038 12.9675C1.49945 14.9235 2.45979 16.7202 3.86997 18.1304C5.28015 19.5406 7.07683 20.5009 9.0328 20.89C10.9888 21.279 13.0162 21.0793 14.8587 20.3162C16.7012 19.553 18.276 18.2606 19.384 16.6024C20.4919 14.9442 21.0833 12.9947 21.0833 11.0004C21.0833 10.7573 20.9867 10.5241 20.8148 10.3522C20.6429 10.1803 20.4097 10.0837 20.1666 10.0837Z"
        fill="#CACACA"
      />
    </Svg>
  )
}