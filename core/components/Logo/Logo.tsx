import { css } from '@maximeheckel/design-system';
import { LogoProps } from './types';

const transitionLogo = css({
  transition: '0.5s',
  willChange: 'stroke, fill',
});

const Logo = ({ alt, size, stroke }: LogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    // width="500"
    // height="500"
    viewBox="0 0 500 500"
    fill="none"
    aria-label={alt}
    className={transitionLogo()}
    width={size || 44}
  // stroke={stroke || 'var(--text-primary)'}
  >
    <path fill-rule="evenodd" clip-rule="evenodd" d="M149 0C66.7096 0 0 66.7096 0 149V351C0 433.29 66.7096 500 149 500H351C433.29 500 500 433.29 500 351V149C500 66.7096 433.29 0 351 0H149ZM92 425.562H188.924V294.215H218.465C222.534 315.699 228.312 334.661 235.799 351.1C243.449 367.376 251.017 381.048 258.504 392.115C267.293 405.136 276.57 416.285 286.336 425.562H407.186C392.537 415.634 377.726 403.834 362.752 390.162C356.404 384.303 349.731 377.874 342.732 370.875C335.734 363.714 328.654 355.982 321.492 347.682C314.493 339.218 307.495 330.185 300.496 320.582C293.66 310.979 287.068 300.807 280.721 290.064C294.881 287.949 308.553 283.635 321.736 277.125C334.92 270.452 346.557 262.151 356.648 252.223C366.902 242.132 375.04 230.738 381.062 218.043C387.247 205.185 390.34 191.513 390.34 177.027C390.34 158.473 386.84 142.685 379.842 129.664C373.006 116.643 363.729 106.064 352.01 97.9258C340.454 89.625 327.107 83.6029 311.971 79.8594C296.834 75.9531 281.128 74 264.852 74H92V425.562ZM274.617 125.025C286.173 136.093 291.951 153.427 291.951 177.027C291.951 188.095 290.649 198.674 288.045 208.766C285.441 218.857 281.372 227.809 275.838 235.621C270.304 243.271 263.143 249.456 254.354 254.176C245.727 258.733 235.311 261.012 223.104 261.012H188.924V108.424H223.104C246.053 108.424 263.224 113.958 274.617 125.025Z"
      // fill={"var(--)"}
      fill={stroke || 'var(--text-primary)'}

    />
  </svg>
);

export default Logo;

// <svg
//   aria-label={alt}
//   className={transitionLogo()}
//   width={size || 44}
//   viewBox="0 0 600 500"
//   xmlns="http://www.w3.org/2000/svg"
//   fill="none"
//   stroke={stroke || 'var(--text-primary)'}
// >
//   <rect
//     x="379.447"
//     y="43.748"
//     width="172.095"
//     height="418.666"
//     rx="86.0473"
//     strokeWidth={30}
//   />
//   <path
//     d="M231.995 351.6L306.965 221.807L381.934 92.0154C404.822 52.3913 458.092 33.3388 500.917 49.4604C543.742 65.5819 559.905 110.773 537.018 150.397L387.079 409.981C364.191 449.605 310.921 468.657 268.096 452.536C225.271 436.414 209.108 391.224 231.995 351.6Z"
//     strokeWidth={30}
//   />
//   <path
//     d="M278.239 272.481L278.206 272.539L278.173 272.597L201.072 408.622C180.402 445.088 131.538 462.758 92.2557 447.97C53.2008 433.268 38.461 392.055 59.3333 355.92L216.867 83.187C237.575 47.3364 285.772 30.0984 324.519 44.6849C363.283 59.2777 377.899 100.192 357.157 136.049L278.239 272.481Z"
//     strokeWidth={30}
//   />
// </svg>