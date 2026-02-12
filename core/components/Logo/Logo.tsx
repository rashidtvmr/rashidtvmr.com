import { css } from '@maximeheckel/design-system';
import { LogoProps } from './types';

const transitionLogo = css({
  transition: '0.5s',
  willChange: 'stroke, fill',
});

const Logo = ({ alt }: LogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 400 400"
    fill="none"
    className={transitionLogo()}
    aria-label={alt}
  >
    <g clipPath="url(#clip0_1_2)">
      <rect width="400" height="400" rx="100" fill="#D7D7D7" />
      <path
        d="M299.345 52H50L124 121H265L247 199H313L338.07 102.017C344.616 76.695 325.5 52 299.345 52Z"
        fill="#001B47"
        stroke="#001B47"
      />
      <path
        d="M158.385 171.045L352.217 345.572L248.862 345.36L139.901 247.251L101.619 317.741L50.6162 271.818L95.9617 182.645C107.889 159.189 138.829 153.437 158.385 171.045Z"
        fill="#001B47"
        stroke="#001B47"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_2">
        <rect width="400" height="400" fill="white" />
      </clipPath>
    </defs>
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
