import React, { FC } from 'react'

import Svg, { Path, SvgProps } from 'react-native-svg'

export const LockedIcon: FC<SvgProps> = (props) => {
  return (
    <Svg {...props} viewBox="0 0 282 210">
      <Path
        d="M188.178 161.647C203.067 163.462 215.842 172.644 226.355 173.902C238.038 175.3 255.708 167.623 273.727 176.659C278.365 178.984 282.173 181.779 280.754 185.252C278.281 191.305 273.077 193.677 261.678 195.322L260.462 195.49C251.65 196.662 242.179 196.945 218.17 197.104L209.966 197.166C180.699 197.421 163.774 198.791 141.857 200.542L139.623 200.723C99.2626 204.044 67.0465 203.512 42.974 199.831L42.247 199.718C22.7981 196.672 11.1051 191.633 5.39719 185.916C2.03696 182.55 0.101379 179.412 0.00149536 176.057C-0.0984192 172.703 4.85751 169.016 7.67908 167.623C15.5391 163.745 18.1038 162.339 33.2145 160.353C39.7206 159.498 49.468 159.566 60.735 159.186C101.154 157.821 163.595 158.649 188.178 161.647Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M199.989 168.962C177.076 220.823 94.1581 219.152 36.4631 183.756C25.4445 176.996 -12.4314 145.133 24.8474 126.527C62.1263 107.922 50.1858 79.3437 80.2711 45.2577C115.063 5.83889 179.855 -14.3786 225.423 38.6576C341.24 173.457 207.704 151.499 199.989 168.962Z"
        fill="#64FCD9"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M46.816 31.4425C44.7503 28.1233 42.6803 26.8497 40.6441 27.9514C38.9204 28.884 38.6337 31.375 39.5508 35.3601L39.0012 35.6565C38.2459 36.0638 37.9637 37.0063 38.371 37.7616C38.4063 37.8269 38.4461 37.8896 38.4903 37.9493L38.7849 38.3434C43.085 44.0477 46.4925 46.3841 49.151 45.0993C51.3855 44.0194 51.7629 39.4199 50.6133 31.0968C50.5328 30.5139 50.0133 30.0996 49.4346 30.1416L49.362 30.1492C49.2308 30.1674 49.1038 30.2089 48.9871 30.2718L46.816 31.4425ZM40.7186 34.4667L45.5127 31.8731L45.5014 31.8554C43.8529 29.2986 42.4562 28.4851 41.2776 29.1228L41.2235 29.1539C40.3532 29.685 40.112 31.3537 40.6663 34.2058L40.7186 34.4667ZM49.3365 31.5961L39.6331 36.8287C39.5251 36.8869 39.4848 37.0215 39.543 37.1294C39.5481 37.1387 39.5538 37.1477 39.5601 37.1562L39.8459 37.5386C43.7764 42.7522 46.7326 44.7887 48.5712 43.9001C49.9682 43.225 50.3349 39.1247 49.3629 31.7899L49.3365 31.5961ZM47.3539 39.9859C47.5822 39.7469 47.7224 39.4229 47.7224 39.0663C47.7224 38.3307 47.1262 37.7345 46.3906 37.7345C45.6551 37.7345 45.0588 38.3307 45.0588 39.0663C45.0588 39.8018 45.6551 40.3981 46.3906 40.3981C46.4485 40.3981 46.5055 40.3944 46.5615 40.3872L47.3185 41.777L47.3459 41.821C47.4741 42.0026 47.7208 42.0634 47.9208 41.9545C48.1361 41.8372 48.2155 41.5676 48.0982 41.3522L47.3539 39.9859Z"
        fill="#FFB61D"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M188.178 161.647C203.067 163.462 215.842 172.644 226.355 173.902C238.038 175.3 255.708 167.623 273.727 176.659C278.365 178.984 282.173 181.779 280.754 185.252C278.281 191.305 273.077 193.677 261.678 195.322L260.462 195.49C251.65 196.662 242.179 196.945 218.17 197.104L209.966 197.166C180.699 197.421 163.774 198.791 141.857 200.542L139.623 200.723C99.2626 204.044 67.0465 203.512 42.974 199.831L42.247 199.718C22.7981 196.672 11.1051 191.633 5.39719 185.916C2.03696 182.55 0.101379 179.412 0.00149536 176.057C-0.0984192 172.703 4.85751 169.016 7.67908 167.623C15.5391 163.745 18.1038 162.339 33.2145 160.353C39.7206 159.498 49.468 159.566 60.735 159.186C101.154 157.821 163.595 158.649 188.178 161.647ZM32.8814 163.163L31.8912 163.295C17.8096 165.204 8.80795 168.678 4.54373 172.142L4.27759 172.364C1.0033 175.186 0.697174 178.358 5.40375 183.047C10.55 188.174 23.6753 193.959 42.6008 196.907C66.294 200.599 98.1483 201.671 138.152 198.46L142.346 198.123C165.441 196.307 183.16 195.34 215.954 195.11L225.007 195.042C244.531 194.866 252.829 194.517 260.841 193.403L261.602 193.294C296.978 186.374 271.452 173.959 256.808 173.902C244.266 173.854 229.202 177.382 225.007 176.061C211.785 171.899 204.996 165.527 188.179 163.488L183.289 162.902L179.115 162.705C110.7 159.527 61.942 159.364 32.8814 163.163Z"
        fill="#00160A"
      />
      <Path
        d="M77.1903 2.38745C76.9473 2.37963 76.7042 2.37989 76.4612 2.38825C70.4744 2.59412 65.775 7.56613 65.8835 13.5368L65.8883 13.718L65.9618 15.9553C66.172 22.6752 66.2877 29.3686 66.3087 36.0355L66.3449 56.5484C66.3529 63.9313 66.3484 70.5947 66.3268 77.1199L66.2971 84.0398C66.1808 106.071 65.8669 121.533 65.2845 128.264L65.172 129.522C64.469 137.748 64.3234 149.562 64.7403 164.938C64.7451 165.116 64.7541 165.294 64.7672 165.471C65.2279 171.705 70.6052 176.4 76.8254 176.042L77.0141 176.03L79.0814 175.879C98.4042 174.501 117.727 173.811 137.05 173.811C155.964 173.811 175.023 174.472 194.226 175.793C194.782 175.831 195.339 175.834 195.895 175.803C203.176 175.391 208.761 169.213 208.469 161.951L208.458 161.73L208.312 159.111C207.023 135.519 206.356 111.926 206.31 88.3332L206.307 85.7118C206.307 68.5161 207.113 44.9327 208.723 14.9515C208.741 14.6156 208.744 14.2791 208.734 13.9429C208.532 7.4348 203.144 2.30898 196.658 2.40541L196.461 2.40993L186.643 2.7076C164.337 3.3655 148.096 3.70927 137.907 3.73884L136.161 3.74079L134.364 3.73613C123.964 3.69147 107.863 3.33479 86.0525 2.66617L77.1903 2.38745Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M195.7 1.77577C194.914 2.20669 193.877 2.50981 192.591 2.68471C195.902 2.97884 198.505 2.91021 200.401 2.47903L199.991 2.4283C198.656 2.25974 197.226 2.04223 195.7 1.77577Z"
        fill="#E7EAEE"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M71.1641 160.535L71.2563 160.538C71.8285 160.578 72.232 161.025 72.1794 161.518C72.1192 162.083 71.5157 162.631 70.8569 162.676C70.3332 162.712 69.9695 162.309 70.0276 161.684C70.0885 161.028 70.6025 160.537 71.1641 160.535Z"
        fill="#E7EAEE"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M81.6441 169.109L81.7363 169.113C82.3085 169.152 82.712 169.599 82.6594 170.093C82.5992 170.657 81.9957 171.205 81.3369 171.25C80.8132 171.287 80.4494 170.884 80.5076 170.258C80.5685 169.602 81.0825 169.112 81.6441 169.109Z"
        fill="#E7EAEE"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M137.166 168.546C114.431 173.563 157.119 172.677 173.771 171.578C182.834 170.98 190.071 175.507 194.226 175.793C194.782 175.831 195.339 175.834 195.895 175.803C203.176 175.391 208.761 169.213 208.468 161.951L208.458 161.73L208.312 159.111C207.023 135.519 206.356 111.926 206.31 88.3331L206.307 85.7117C206.307 68.516 207.113 44.9327 208.722 14.9514C208.74 14.6155 208.744 14.279 208.734 13.9429C208.532 7.43475 196.06 155.548 137.166 168.546Z"
        fill="#E7EAEE"
      />
      <Path
        d="M204.596 162.481L204.676 162.484C205.09 162.517 205.43 162.948 205.381 163.475C205.327 164.058 204.824 164.583 204.322 164.622C203.969 164.65 203.671 164.271 203.724 163.619C203.778 162.953 204.195 162.491 204.596 162.481Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M204.453 166.284C202.973 166.401 201.933 165.078 202.062 163.485C202.187 161.937 203.366 160.708 204.782 160.82C206.175 160.93 207.174 162.201 207.041 163.629C206.914 165.001 205.784 166.179 204.453 166.284ZM204.677 162.484L204.597 162.481C204.196 162.491 203.778 162.953 203.724 163.619C203.672 164.271 203.97 164.65 204.322 164.622C204.824 164.583 205.327 164.058 205.381 163.475C205.43 162.948 205.091 162.517 204.677 162.484Z"
        fill="white"
      />
      <Path
        d="M190.514 11.9961C195.776 11.9961 200.041 16.2615 200.041 21.5231C200.041 21.72 200.035 21.9169 200.023 22.1135L199.883 24.4474C199.627 28.8771 199.372 34.1364 199.117 40.2254L199.078 41.2003C198.456 57.5799 198.436 96.3305 199.019 157.452C199.069 162.714 194.845 167.019 189.583 167.07C189.455 167.071 189.327 167.069 189.199 167.066L84.6777 163.841C79.838 163.692 75.8801 159.936 75.4775 155.111L75.3888 154.021C74.0122 136.67 73.9303 114.516 75.143 87.557L75.3208 83.6909C75.9401 69.5043 75.9887 48.8428 75.4666 21.7064C75.3664 16.5005 79.4612 12.1897 84.6445 12.0024L84.9002 11.9965L190.514 11.9961Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M120.241 124.347C124.859 124.541 129.601 123.722 133.713 121.713C138.863 119.197 142.739 114.975 144.884 108.921C147.709 100.947 146.671 92.3248 142.61 84.7361C138.994 77.9817 133.31 72.8412 128.071 71.5701C128.071 71.5701 142.61 92.0213 140.527 103.201C137.342 120.296 120.241 124.347 120.241 124.347Z"
        fill="#E7EAEE"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M123.599 100.329C125.846 101.261 126.532 102.993 125.657 105.526L125.607 105.667C119.916 121.292 113.205 121.435 118.948 105.667C119.644 103.757 119.471 102.291 118.43 101.271C120.27 100.898 121.992 100.584 123.599 100.329Z"
        fill="#E7EAEE"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M87.9573 82.0645C89.4297 77.6898 91.5797 74.4012 95.598 71.801L96.1084 71.4774C96.9755 70.9331 98.0442 70.3169 98.9134 70.7379C100.018 71.2727 101.617 73.2219 100.644 73.9871C99.9843 74.506 97.2683 75.0578 95.221 76.8514C92.804 78.9687 91.0644 82.3807 91.0644 83.2162C91.0644 85.9418 87.0879 84.6478 87.9573 82.0645Z"
        fill="#E7EAEE"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M83.4035 19.7116C78.349 33.5902 78.3834 36.3439 78.0801 33.9517C77.0992 26.2154 76.3593 21.1316 77.5248 18.0434C79.0004 14.1337 82.6993 13.3647 83.6521 13.8185C85.6664 14.7778 83.4035 19.7116 83.4035 19.7116Z"
        fill="#E7EAEE"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M166.563 91.0364L164.881 90.9849C162.886 90.9341 161.448 90.9461 160.242 91.0403C159.273 91.116 158.55 91.2483 158.14 91.3776L158.059 91.4047L158.051 91.4429C158.006 91.6692 157.974 91.9722 157.959 92.3382L157.955 92.4783C157.928 93.5771 158.061 95.0449 158.325 96.6841C158.541 98.0283 158.837 99.4245 159.145 100.601L159.222 100.891C159.342 101.33 159.457 101.712 159.558 102.009L159.595 102.115L159.639 102.131C160.258 102.352 161.49 102.378 163.865 102.203L165.478 102.077C166.565 101.997 167.357 101.962 168.138 101.972L175.719 102.131C176.78 102.151 177.738 102.166 178.677 102.179L180.38 102.198C184.633 102.445 189.307 102.26 189.888 101.201C191.662 97.9724 192.498 91.3228 191.662 91.2784C190.157 91.1984 188.336 91.104 187.471 91.1154L185.473 91.1516L183.662 91.1661C182.835 91.1709 181.972 91.1735 181.046 91.1743L170.656 91.1503C169.981 91.1457 169.319 91.1293 168.127 91.0898L166.563 91.0364Z"
        fill="#E7EAEE"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M86.8975 0.309115L77.2671 0.00690665C76.9713 -0.00261567 76.6753 -0.00229146 76.3796 0.00787875C69.0177 0.261033 63.2549 6.43426 63.508 13.7962L63.5814 16.0297C63.6677 18.788 63.799 21.5417 63.93 24.2909L63.93 24.2909C64.1526 28.9592 64.3746 33.6145 64.3746 38.2567L64.4055 55.0938C64.4351 78.5739 64.364 117.244 63.3211 128.444L63.2427 129.323C62.5648 137.259 61.9558 148.424 62.3036 162.819L62.3596 165.003C62.3654 165.218 62.3763 165.432 62.3921 165.647C62.9544 173.255 69.5782 178.967 77.1868 178.405L79.2511 178.255L79.5932 178.231C79.6615 178.345 79.7308 178.459 79.7992 178.572L79.8011 178.575L79.8012 178.575C80.1354 179.127 80.4478 179.643 80.5204 179.896C80.7035 180.534 80.7228 181.257 80.6171 182.893L80.5099 184.427L80.4808 184.925C80.3248 187.981 80.6778 189.8 82.169 191.169C84.0868 192.93 86.1186 192.744 90.2815 192.361L90.4686 192.344L91.5403 192.24C92.779 192.12 94.1718 192.217 95.1209 192.283C95.3942 192.302 95.6307 192.318 95.8161 192.326L96.1665 192.344C98.5552 192.439 98.9345 191.653 99.1436 189.709C99.2588 188.638 99.1087 187.795 98.4794 185.621L98.0085 184.019L97.8522 183.461C97.1171 180.745 97.1842 179.389 98.1419 178.733C98.3742 178.574 99.3447 178.285 100.464 177.953L100.464 177.953L100.465 177.952C101.616 177.61 102.925 177.221 103.749 176.877C114.85 176.421 125.95 176.193 137.051 176.193C148.714 176.193 160.433 176.445 172.208 176.949C172.13 177.076 172.116 177.26 172.199 177.516C172.292 177.805 172.647 178.006 173.099 178.262C174.3 178.941 176.191 180.01 175.751 184.165L175.753 184.336C175.819 187.611 177.804 189.532 180.998 190.184C183.133 190.62 185.562 190.488 188.207 190.03C189.517 189.802 190.36 188.983 190.763 187.735C190.986 187.046 191.065 186.427 191.117 185.194C191.117 185.194 190.535 178.79 193.774 178.149C193.87 178.155 193.966 178.162 194.063 178.169C194.438 178.194 194.814 178.207 195.19 178.206C195.24 178.218 195.291 178.23 195.343 178.244C195.498 178.286 195.646 178.262 195.779 178.193C195.863 178.189 195.946 178.185 196.03 178.181C204.697 177.69 211.327 170.266 210.836 161.598L210.691 158.981C209.356 134.558 208.689 110.135 208.689 85.7117C208.689 69.0801 209.446 46.4284 210.959 17.7567L211.101 15.0791C211.123 14.6761 211.127 14.2723 211.115 13.8689C210.869 5.98027 204.276 -0.215922 196.387 0.0293003L191.387 0.182845C166.611 0.934031 148.784 1.32544 137.904 1.35707L136.163 1.35902C126.006 1.35116 109.584 1.0012 86.8975 0.309115ZM190.522 177.933C185.017 177.577 179.524 177.276 174.043 177.029C176.668 178.303 177.603 180.681 177.655 183.971L177.657 184.165C177.657 186.293 179.313 187.683 181.54 188.138C181.773 188.185 182.012 188.237 182.257 188.29C183.795 188.624 185.554 189.005 187.504 188.685L187.8 188.635C189.149 188.138 189.149 183.291 189.149 183.291C189.164 182.897 189.178 182.64 189.201 182.327L189.23 181.976C189.399 180.212 189.767 178.894 190.522 177.933ZM82.8098 179.239C82.6804 178.788 82.4958 178.389 82.2572 178.046C86.9305 177.73 91.6037 177.454 96.2769 177.219C95.5468 178.033 95.4783 179.132 95.4513 180.445C95.4281 181.576 95.6568 182.779 96.1377 184.473L96.1665 184.575L96.6064 186.072C97.1451 187.923 97.307 188.696 97.2616 189.344L97.2518 189.454C97.1871 190.056 96.4144 190.735 95.1089 190.659L94.8753 190.647C94.3157 190.562 88.8012 190.659 88.8012 190.659C86.2549 190.917 85.029 190.562 83.7799 189.415C82.9412 188.645 82.7163 187.277 82.8816 184.66L82.9846 183.19C83.114 181.27 83.1032 180.37 82.8613 179.428L82.8098 179.239ZM76.4614 2.38822C76.7043 2.37987 76.9475 2.3796 77.1904 2.38743L86.0526 2.66615C107.863 3.33477 123.964 3.69145 134.364 3.73611L136.161 3.74077L137.907 3.73882C148.096 3.70925 164.337 3.36547 186.643 2.70758L196.461 2.40991L196.658 2.40538C203.144 2.30896 208.532 7.43478 208.734 13.9429C208.745 14.2791 208.741 14.6156 208.723 14.9514C207.113 44.9327 206.308 68.5161 206.308 85.7118L206.31 88.3332C206.356 111.926 207.024 135.519 208.312 159.111L208.458 161.73L208.469 161.951C208.762 169.213 203.176 175.391 195.895 175.803C195.339 175.834 194.782 175.831 194.226 175.793C175.023 174.472 155.964 173.811 137.051 173.811C117.727 173.811 98.4043 174.501 79.0815 175.879L77.0143 176.03L76.8255 176.042C70.6053 176.4 65.228 171.705 64.7673 165.471C64.7542 165.294 64.7453 165.116 64.7404 164.938C64.3235 149.562 64.4692 137.748 65.1721 129.522L65.2846 128.264C65.867 121.533 66.1809 106.071 66.2973 84.0398L66.3269 77.1199C66.3485 70.5947 66.3531 63.9313 66.345 56.5484L66.3088 36.0355C66.2878 29.3686 66.1722 22.6752 65.9619 15.9552L65.8884 13.718L65.8837 13.5368C65.7752 7.5661 70.4746 2.59409 76.4614 2.38822ZM200.041 21.5231C200.041 16.2614 195.776 11.9961 190.514 11.9961L84.9004 11.9965L84.6447 12.0024C79.4614 12.1897 75.3666 16.5005 75.4668 21.7063C75.9889 48.8428 75.9403 69.5043 75.321 83.6909L75.1432 87.557C73.9305 114.516 74.0124 136.67 75.389 154.021L75.4777 155.111C75.8803 159.936 79.8382 163.691 84.6779 163.841L189.199 167.065C189.327 167.069 189.455 167.071 189.584 167.07C194.845 167.019 199.07 162.714 199.019 157.452C198.436 96.3305 198.456 57.5799 199.078 41.2002L199.117 40.2254C199.372 34.1364 199.627 28.877 199.883 24.4473L200.023 22.1134C200.035 21.9169 200.041 21.72 200.041 21.5231ZM84.9919 14.3778H190.514C194.46 14.3778 197.66 17.5768 197.66 21.5231C197.66 21.6708 197.655 21.8184 197.646 21.9658C197.396 25.9833 197.148 30.7794 196.9 36.3549L196.737 40.1258C196.108 55.1734 196.047 91.2081 196.553 148.287L196.638 157.475C196.675 161.421 193.507 164.65 189.561 164.688C189.465 164.689 189.368 164.688 189.272 164.685L84.7512 161.46L84.5938 161.454C81.036 161.266 78.1487 158.479 77.8511 154.913C76.3844 137.338 76.2863 114.632 77.5611 86.8113L77.6808 84.2368C78.282 70.8501 78.3674 51.6529 77.9385 26.6305L77.848 21.6605C77.7721 17.715 80.909 14.455 84.8544 14.3791C84.9003 14.3783 84.9461 14.3778 84.9919 14.3778ZM81.3417 7.07326C81.4922 8.69247 80.3188 9.99191 78.7379 9.88311C77.292 9.78361 76.0203 8.62913 75.872 7.23878L75.8632 7.13714C75.7713 5.7538 76.8311 4.57783 78.253 4.427L78.3603 4.41762C79.8765 4.31328 81.1967 5.5117 81.3417 7.07326ZM78.5457 6.07862L78.4535 6.0821C77.8812 6.12177 77.4777 6.56867 77.5303 7.06193C77.5906 7.62664 78.194 8.17446 78.8528 8.2198C79.3765 8.25583 79.7403 7.85297 79.6822 7.22745C79.6212 6.57161 79.1073 6.08099 78.5457 6.07862ZM70.1158 19.7022C68.4676 19.8484 67.357 18.2628 67.494 16.3611C67.6284 14.4972 68.9084 12.9992 70.4933 13.1398L70.5956 13.151C72.0514 13.3403 73.0571 14.7723 72.9746 16.3775L72.9671 16.4897C72.8313 18.1305 71.6009 19.5705 70.1158 19.7022ZM70.3709 14.8023L70.29 14.7984C69.7845 14.8046 69.2285 15.4877 69.1569 16.4809C69.0854 17.4731 69.5119 18.082 69.9684 18.0415C70.5879 17.9866 71.2327 17.2319 71.3055 16.3523C71.3744 15.5194 70.9056 14.8501 70.3709 14.8023ZM193.529 7.07326C193.379 8.69247 194.552 9.99191 196.133 9.88311C197.579 9.78361 198.85 8.62913 198.999 7.23878L199.007 7.13714C199.099 5.7538 198.04 4.57783 196.618 4.427L196.51 4.41762C194.994 4.31328 193.674 5.5117 193.529 7.07326ZM196.326 6.07862L196.418 6.0821C196.99 6.12177 197.394 6.56867 197.341 7.06193C197.281 7.62664 196.677 8.17446 196.018 8.2198C195.495 8.25583 195.131 7.85297 195.189 7.22745C195.25 6.57161 195.764 6.08099 196.326 6.07862ZM202.407 16.977C201.522 15.6623 202.061 13.9964 203.538 13.3171C204.963 12.6619 206.661 13.206 207.329 14.5713L207.374 14.6689C207.955 15.9757 207.466 17.4815 206.222 18.0936L206.13 18.1368C204.852 18.7035 203.216 18.1794 202.407 16.977ZM205.841 15.3232L205.798 15.2416C205.515 14.7565 204.833 14.5566 204.235 14.8318C203.664 15.0942 203.497 15.6107 203.79 16.0462C204.159 16.5941 204.935 16.8428 205.454 16.6126C205.908 16.4115 206.093 15.8386 205.841 15.3232ZM68.9387 159.67C67.7827 160.814 67.8462 162.564 69.1272 163.496C70.2988 164.35 72.0151 164.283 73.0224 163.313L73.0944 163.241C74.054 162.24 73.9981 160.658 73.0058 159.628L72.9296 159.552C71.8352 158.498 70.0536 158.567 68.9387 159.67ZM71.7201 160.706L71.7885 160.768C72.2014 161.166 72.2232 161.768 71.8659 162.112C71.4567 162.506 70.6423 162.537 70.1085 162.149C69.6842 161.84 69.6645 161.297 70.1111 160.855C70.5793 160.392 71.2884 160.347 71.7201 160.706ZM79.607 172.071C78.326 171.138 78.2624 169.388 79.4185 168.245C80.5334 167.142 82.315 167.072 83.4094 168.127L83.4856 168.203C84.4779 169.232 84.5338 170.814 83.5742 171.815L83.5022 171.887C82.4949 172.857 80.7786 172.924 79.607 172.071ZM82.2687 169.342L82.2003 169.28C81.7685 168.921 81.0594 168.966 80.5912 169.43C80.1446 169.872 80.1643 170.414 80.5886 170.723C81.1225 171.112 81.9369 171.08 82.346 170.686C82.7034 170.342 82.6815 169.74 82.2687 169.342ZM196.892 168.798C195.564 170.137 195.529 172.106 196.943 173.118C198.238 174.046 200.176 173.863 201.336 172.721C202.538 171.538 202.573 169.634 201.39 168.476C200.193 167.304 198.185 167.494 196.892 168.798ZM200.171 169.62L200.239 169.682C200.729 170.162 200.714 170.994 200.167 171.533C199.577 172.114 198.54 172.212 197.914 171.763C197.406 171.4 197.42 170.633 198.076 169.972C198.741 169.301 199.666 169.193 200.171 169.62ZM204.453 166.284C202.973 166.401 201.933 165.078 202.062 163.485C202.187 161.937 203.366 160.708 204.782 160.82C206.174 160.93 207.173 162.201 207.041 163.629C206.913 165.001 205.784 166.179 204.453 166.284ZM204.677 162.484L204.597 162.481C204.196 162.491 203.778 162.953 203.724 163.619C203.672 164.271 203.97 164.65 204.322 164.622C204.824 164.583 205.327 164.058 205.381 163.475C205.43 162.948 205.091 162.517 204.677 162.484Z"
        fill="#00160A"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M79.4185 168.245C78.2625 169.388 78.326 171.138 79.6071 172.071C80.7786 172.924 82.4949 172.857 83.5022 171.887L83.5742 171.815C84.5338 170.814 84.4779 169.232 83.4856 168.203L83.4094 168.127C82.315 167.072 80.5334 167.142 79.4185 168.245ZM82.2003 169.28L82.2687 169.342C82.6815 169.74 82.7034 170.342 82.346 170.686C81.9369 171.08 81.1225 171.112 80.5887 170.723C80.1643 170.414 80.1446 169.872 80.5912 169.43C81.0595 168.966 81.7686 168.921 82.2003 169.28Z"
        fill="#00160A"
      />
      <Path
        d="M200.171 169.62L200.239 169.682C200.729 170.162 200.714 170.994 200.167 171.533C199.577 172.114 198.54 172.212 197.914 171.763C197.406 171.4 197.42 170.633 198.076 169.972C198.741 169.301 199.666 169.193 200.171 169.62Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M95.039 67.3862C94.4892 67.5771 93.9932 67.8361 93.3802 68.2136L92.9097 68.5087L92.6764 68.6574C89.1241 70.9503 86.7526 73.8017 85.0654 77.6631L84.9751 77.8721L84.9075 77.8519C84.4597 77.7205 84.0538 77.6561 83.6198 77.6922C82.6947 77.7691 81.8323 78.3234 81.5243 79.3567C81.0431 80.9704 81.2418 82.8159 81.8664 84.7053L81.9836 85.0512C82.593 86.8026 83.2675 87.9911 84.3888 88.3381C85.8796 88.7993 91.03 86.7578 92.826 84.905C94.107 83.5835 93.594 81.9673 92.3748 81.0345L92.2628 80.9517L92.1449 80.8702L92.0113 80.7836L92.1006 80.6237C92.163 80.5139 92.2283 80.4023 92.2962 80.2896C93.0245 79.082 93.9352 77.9401 94.8578 77.1319C95.213 76.8207 95.6239 76.5354 96.0921 76.2692C96.8168 75.8573 99.707 74.7228 100.193 74.3401C101.756 73.111 101.575 71.331 100.587 69.7881C99.9724 68.8284 99.006 67.9291 98.072 67.4767C97.0908 67.0016 96.0641 67.0302 95.039 67.3862ZM97.1377 69.406C98.2422 69.9409 99.8413 71.89 98.8683 72.6553C98.2086 73.1742 95.4926 73.7259 93.4453 75.5195C91.0284 77.6369 89.2887 81.0489 89.2887 81.8844L89.5644 81.9878C91.0715 82.5679 91.6457 83.0429 91.2869 83.4131C89.6885 85.0619 85.3442 86.3899 85.0225 86.2903C84.7059 86.1924 82.8315 82.4746 83.5785 79.9691C83.6784 79.6342 84.5461 79.8887 86.1816 80.7327C87.654 76.358 89.804 73.0694 93.8223 70.4692L94.3328 70.1455C95.1998 69.6013 96.2685 68.9851 97.1377 69.406Z"
        fill="#00160A"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M98.2905 116.714C89.4667 107.071 88.956 90.6209 98.4885 80.0274C104.411 73.446 118.33 69.2069 128.071 71.5701C133.31 72.8412 138.994 77.9817 142.609 84.7361C146.671 92.3248 147.709 100.947 144.884 108.921C142.738 114.975 138.863 119.197 133.713 121.713C129.601 123.722 124.859 124.541 120.241 124.347C111.908 123.996 101.546 120.272 98.2905 116.714ZM140.51 85.8601C137.19 79.6571 132.016 74.9781 127.51 73.8847L127.242 73.8218C118.357 71.8066 105.54 75.7523 100.259 81.6206C91.5661 91.2815 92.0338 106.348 100.048 115.106C102.814 118.129 112.586 121.641 120.342 121.967C124.587 122.146 128.94 121.394 132.668 119.573C137.268 117.325 140.706 113.579 142.639 108.125C145.227 100.823 144.272 92.8879 140.51 85.8601ZM135.922 108.68C141.192 99.4272 134.048 79.4484 124.068 77.7811C114.688 76.2138 111.132 78.4892 107.086 81.9973L106.304 82.6835C98.3862 89.6838 98.3862 104.722 106.121 111.699C108.065 113.452 116.617 117.95 123.18 116.574C127.532 115.662 133.588 112.778 135.922 108.68ZM113.896 80.391C114.393 80.2129 114.917 80.0662 115.475 79.9519C115.4 80.1252 115.336 80.3092 115.283 80.5037C114.987 81.5914 115.017 82.522 115.336 84.7871L115.554 86.288C115.573 86.4204 115.59 86.5417 115.606 86.6659L115.654 87.0478C115.993 89.9153 115.685 91.4111 114.403 92.2361C113.23 92.9911 112.076 93.2762 109.44 93.5829L108.453 93.6946C107.237 93.8347 106.598 93.9317 105.83 94.1051L105.483 94.1751C104.419 94.399 103.535 94.6769 102.849 95.0269C103.302 90.9304 104.979 87.0338 107.881 84.4679C110.618 82.0477 111.999 81.0712 113.896 80.391ZM123.675 80.1303C123.29 80.0659 122.915 80.0082 122.55 79.9572C122.626 80.1508 122.691 80.3567 122.744 80.5743C122.967 81.4827 123.006 82.2892 122.952 84.1268L122.925 84.9195C122.898 85.6826 122.884 86.1365 122.881 86.5726L122.88 87.0954C122.903 89.4199 123.267 90.9652 124.161 92.0117L124.261 92.1232L124.3 92.14C124.355 92.1622 124.425 92.1875 124.509 92.2153L124.597 92.244C124.802 92.3092 125.059 92.3819 125.387 92.4683L125.937 92.6088L128.284 93.1836C128.746 93.2981 129.156 93.4026 129.548 93.5063L130.194 93.6804C132.135 94.2149 133.623 94.7359 134.705 95.317C133.089 88.0819 128.64 80.9597 123.675 80.1303ZM134.965 100.638C135.099 100.553 135.225 100.466 135.345 100.378C135.403 103.076 134.951 105.572 133.852 107.501C132.274 110.271 127.891 112.91 123.61 114.027C123.719 113.753 123.806 113.457 123.874 113.139C124.082 112.162 124.115 111.043 124.033 109.458L123.982 108.606L123.904 107.484C123.757 105.244 123.793 104.306 123.988 104.082C124.867 103.072 126.084 102.685 129.182 102.241L129.901 102.138C132.49 101.76 133.705 101.441 134.965 100.638ZM116.76 112.866C116.793 113.268 116.926 113.678 117.143 114.065C116.044 113.833 114.902 113.5 113.737 113.074C111.132 112.12 108.606 110.733 107.716 109.93C104.891 107.382 103.265 103.536 102.838 99.4864C103.57 99.8235 104.538 100.109 105.739 100.393L105.924 100.436C106.409 100.549 106.905 100.654 107.49 100.769L109.163 101.094C112.908 101.863 114.841 102.755 115.724 103.946L115.813 104.071C116.398 104.924 116.56 105.89 116.607 108.398L116.634 110.184C116.654 111.253 116.687 111.963 116.76 112.866ZM119.578 80.0529L119.685 80.0625C120.696 80.1832 120.91 81.1207 120.79 84.657L120.75 85.8829C120.74 86.2525 120.736 86.5502 120.736 86.8764C120.738 89.0938 121.003 90.8164 121.716 92.196C121.583 92.125 121.431 92.0848 121.269 92.0848L121.107 92.0869L121.067 92.088L121.049 92.0805C120.775 91.979 120.476 92.0112 120.234 92.1533L120.21 92.1685L120.126 92.1821C118.049 92.5284 115.984 93.7693 114.877 95.413C113.689 97.1761 113.748 99.1008 115.102 100.749C113.813 100.069 112.103 99.5235 109.846 99.0465L109.118 98.9003C108.689 98.8171 108.155 98.7147 108.154 98.7147L107.724 98.6299C107.308 98.5467 106.939 98.4689 106.585 98.3887L106.409 98.3483C105.334 98.0987 104.485 97.8427 103.892 97.5753L103.798 97.5316C103.615 97.4447 103.47 97.3613 103.367 97.2866L103.353 97.2759L103.379 97.2489C103.453 97.1761 103.564 97.0933 103.716 97.0056C104.236 96.7051 105.094 96.4299 106.27 96.203L106.568 96.1388C107.091 96.0311 107.604 95.9542 108.405 95.8587L109.704 95.7103C112.66 95.3662 114.029 95.0266 115.564 94.0387C117.803 92.5981 118.23 90.3454 117.758 86.5878L117.706 86.1913C117.679 85.9967 117.65 85.7944 117.612 85.5355L117.465 84.5204C117.199 82.6325 117.161 81.8224 117.335 81.1289L117.352 81.0661C117.564 80.2846 118.106 79.9611 119.578 80.0529ZM117.364 102.56C117.392 102.596 117.42 102.633 117.447 102.669C118.459 104.035 118.692 105.241 118.75 108.321L118.774 109.949C118.792 110.967 118.818 111.638 118.876 112.414L118.898 112.694C118.942 113.244 119.882 114.12 120.92 113.921C121.729 113.767 122.041 112.442 121.889 109.494L121.868 109.125L121.75 107.394C121.563 104.561 121.622 103.62 122.269 102.799C120.719 103.383 118.916 103.355 117.364 102.56ZM124.769 101.01C125.73 100.647 126.954 100.401 128.654 100.152L129.575 100.02C131.727 99.7053 132.768 99.4481 133.65 98.9305L133.813 98.8303C134.811 98.1947 134.907 98.0681 134.463 97.7098L134.32 97.5986C133.535 97.0079 132.02 96.418 129.838 95.8061L129.377 95.6792C128.88 95.5445 128.368 95.413 127.766 95.2633L125.259 94.6486C124.785 94.5293 124.406 94.4298 124.098 94.3384C126.035 96.3872 126.356 98.6932 125.024 100.663L124.949 100.772C124.891 100.853 124.831 100.933 124.769 101.01ZM120.509 94.0503L120.644 94.031L120.74 94.0888C123.856 95.9833 124.549 98.0473 123.397 99.667C122.251 101.278 119.734 101.835 117.928 100.69C115.834 99.3633 115.486 97.9204 116.458 96.4773C117.278 95.2587 118.919 94.2946 120.509 94.0503Z"
        fill="#00160A"
      />
      <Path
        d="M151.92 88.8695C152.008 88.5476 152.094 88.4566 152.094 88.454C152.397 88.234 153.031 88.0105 154.081 87.8617C155.099 87.7176 156.343 87.6639 157.712 87.6611C159.076 87.6583 160.527 87.7058 161.956 87.7553C162.04 87.7582 162.123 87.7611 162.207 87.764C163.54 87.8104 164.851 87.856 166.012 87.8572C167.38 87.8588 168.769 87.8635 170.169 87.8683C173.591 87.8799 177.074 87.8918 180.442 87.8572C180.589 87.8557 180.802 87.8512 181.066 87.8457C182.141 87.8231 184.083 87.7823 186.063 87.8461C187.295 87.8857 188.505 87.9652 189.496 88.1087C189.992 88.1804 190.409 88.2648 190.735 88.3596C191.08 88.4602 191.236 88.548 191.279 88.5803C191.354 88.6376 191.512 88.8151 191.68 89.2322C191.841 89.6332 191.977 90.1665 192.07 90.8118C192.258 92.1013 192.26 93.7007 192.075 95.2767C191.89 96.8595 191.526 98.3356 191.032 99.4032C190.498 100.559 190.006 100.843 189.773 100.868C183.847 101.512 173.832 101.292 165.858 101.118C164.964 101.098 164.096 101.079 163.262 101.062C162.261 101.041 161.215 101.108 160.211 101.186C159.968 101.205 159.728 101.224 159.491 101.244C158.732 101.305 158.005 101.364 157.303 101.394C156.385 101.432 155.584 101.416 154.918 101.305C154.33 101.207 153.913 101.045 153.623 100.838C153.59 100.768 153.547 100.665 153.496 100.525C153.369 100.181 153.217 99.6955 153.055 99.0998C152.731 97.9123 152.386 96.3569 152.13 94.7698C151.873 93.174 151.715 91.5957 151.746 90.3455C151.761 89.7179 151.823 89.223 151.92 88.8695ZM153.672 100.934C153.672 100.935 153.668 100.929 153.661 100.916C153.668 100.927 153.672 100.934 153.672 100.934Z"
        stroke="#421EB7"
        stroke-width="2.38175"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M165.987 86.897C167.36 86.8985 168.754 86.9033 170.156 86.9081C173.039 86.9179 175.958 86.9279 178.817 86.91L180.404 86.897C180.54 86.8956 180.742 86.8914 180.997 86.886C183.382 86.8357 190.424 86.6871 191.972 87.8624C194.505 89.7849 193.497 101.889 189.875 102.282C183.865 102.935 173.764 102.714 165.813 102.539H165.813H165.813H165.813L165.811 102.539L165.807 102.539C164.911 102.519 164.043 102.5 163.211 102.483C162.054 102.459 160.808 102.56 159.577 102.66H159.577C156.818 102.884 154.138 103.101 152.712 101.889C151.977 101.264 149.144 89.3677 151.35 87.734C153.036 86.4853 157.871 86.6533 162.215 86.8043C163.293 86.8418 164.341 86.8782 165.303 86.8916L165.305 86.8903L165.306 86.8917C165.538 86.8949 165.765 86.8968 165.987 86.897ZM163.082 89.2168C163.316 89.2245 163.53 89.2314 163.727 89.2374C163.887 90.2237 163.906 91.957 163.791 94.5106L163.706 96.3559C163.631 98.0806 163.603 99.2543 163.653 100.111L163.093 100.099C162.311 100.089 161.52 100.124 160.433 100.204L158.82 100.33C156.445 100.505 155.213 100.479 154.593 100.258L154.549 100.242L154.513 100.136C154.412 99.8386 154.296 99.4568 154.177 99.0176L154.1 98.7281C153.791 97.5514 153.496 96.1552 153.279 94.8111C153.015 93.1718 152.883 91.7041 152.91 90.6053L152.914 90.4651C152.928 90.0992 152.961 89.7962 153.006 89.5698L153.014 89.5316L153.095 89.5046C153.504 89.3752 154.228 89.243 155.196 89.1673C156.403 89.073 157.841 89.0611 159.836 89.1118L161.517 89.1633L163.082 89.2168ZM170.674 100.258L166.069 100.161C166.044 99.8912 166.026 99.5595 166.02 99.1753L166.019 99.0928C166.011 98.4895 166.023 97.9134 166.066 96.9011L166.2 93.9243C166.281 91.879 166.283 90.3943 166.148 89.2785L176.001 89.3013C176.528 89.3008 177.036 89.2997 177.527 89.298C177.376 92.2613 177.616 97.4446 177.924 100.339C177.093 100.338 176.23 100.333 175.334 100.325L173.631 100.306C172.693 100.293 171.734 100.278 170.674 100.258ZM180.344 100.331C184.004 100.301 186.942 100.182 189.22 99.9559L189.433 99.9337L189.462 99.904C189.583 99.7663 189.725 99.545 189.87 99.2486L189.925 99.1339C190.353 98.2089 190.691 96.8609 190.866 95.3688C191.039 93.8922 191.037 92.3958 190.865 91.2137C190.786 90.6683 190.674 90.2208 190.548 89.9078L190.513 89.8236L190.486 89.7679L190.391 89.7383C190.136 89.6629 189.786 89.5904 189.358 89.5266C188.514 89.4008 187.427 89.3169 186.156 89.2722C184.973 89.2307 183.772 89.2245 182.426 89.2424L180.428 89.2786L179.861 89.2831C179.842 89.6052 179.828 89.9882 179.823 90.4174L179.822 90.5568C179.812 91.7179 179.853 93.1804 179.936 94.8L179.953 95.1259C180.021 96.3964 180.112 97.709 180.208 98.8635L180.267 99.5357C180.293 99.8229 180.319 100.09 180.344 100.331ZM169.855 93.3015L170.072 93.6129C170.32 93.9624 170.554 94.2716 170.777 94.5445C170.478 95.1971 170.32 95.9302 170.271 96.8737C170.253 97.2168 170.517 97.5095 170.86 97.5274C171.203 97.5453 171.496 97.2817 171.514 96.9386C171.542 96.395 171.608 95.9468 171.727 95.5489C172.416 96.1513 173.018 96.375 173.652 96.3866L173.774 96.3867C174.118 96.3867 174.397 96.1082 174.397 95.7646C174.397 95.4425 174.152 95.1776 173.838 95.1457L173.774 95.1425L173.67 95.1425C173.264 95.1333 172.855 94.9622 172.298 94.4C172.479 94.1463 172.698 93.8945 172.959 93.6259L173.627 92.9658C173.871 92.7239 173.872 92.3301 173.631 92.086C173.389 91.842 172.995 91.8403 172.751 92.0822L172.192 92.6323C171.921 92.9037 171.682 93.1648 171.474 93.4263L171.248 93.1195C171.131 92.958 171.009 92.7842 170.88 92.5973C170.686 92.314 170.299 92.2421 170.015 92.4366C169.732 92.631 169.66 93.0183 169.855 93.3015ZM186.842 92.7092L186.848 92.3295C186.851 91.986 186.575 91.7051 186.231 91.7023C185.888 91.6995 185.607 91.9757 185.604 92.3192C185.601 92.6971 185.591 93.0357 185.575 93.3387C185.257 93.2382 184.913 93.155 184.536 93.0818L183.765 92.9381C183.428 92.874 183.102 93.0957 183.038 93.4333C182.974 93.7708 183.196 94.0964 183.533 94.1605L184.456 94.3346C184.823 94.4111 185.145 94.4974 185.437 94.6063C185.29 95.384 185.046 95.7546 184.715 95.9894L184.628 96.0477L184.577 96.0859C184.335 96.2878 184.28 96.6443 184.46 96.9113C184.652 97.1962 185.039 97.2713 185.324 97.0792L185.425 97.0107C185.944 96.6467 186.319 96.1242 186.553 95.2397C186.874 95.5032 187.179 95.8377 187.507 96.2725C187.714 96.5469 188.104 96.6018 188.378 96.3951C188.652 96.1884 188.707 95.7983 188.501 95.5239C187.932 94.7693 187.392 94.2494 186.779 93.8758C186.811 93.5248 186.832 93.1375 186.842 92.7092Z"
        fill="#00160A"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M159.7 92.6562L159.603 93.0231C159.489 93.4363 159.375 93.807 159.259 94.1397C159.763 94.6505 160.162 95.2857 160.531 96.1554C160.665 96.4717 160.517 96.8369 160.201 96.9711C159.885 97.1053 159.52 96.9576 159.385 96.6414C159.173 96.1402 158.957 95.7417 158.71 95.4085C158.269 96.21 157.779 96.6264 157.187 96.8541L157.072 96.896C156.749 97.0135 156.392 96.8471 156.275 96.5242C156.165 96.2215 156.304 95.8888 156.588 95.7516L156.647 95.7268L156.745 95.6912C157.123 95.5436 157.449 95.2429 157.78 94.524C157.523 94.3476 157.231 94.1859 156.894 94.0229L156.041 93.6308C155.729 93.487 155.593 93.1175 155.736 92.8055C155.88 92.4934 156.25 92.3571 156.562 92.5009L157.275 92.8268C157.623 92.989 157.936 93.1529 158.221 93.3274C158.31 93.0373 158.401 92.7111 158.496 92.3452C158.582 92.0126 158.921 91.8125 159.254 91.8984C159.586 91.9842 159.786 92.3235 159.7 92.6562Z"
        fill="#64FCD9"
      />
    </Svg>
  )
}