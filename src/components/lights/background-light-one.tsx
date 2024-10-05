export default function BackgroundLightOne({
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      // xmlns:svgjs="http://svgjs.dev/svgjs"
      viewBox="0 0 800 800"
      opacity="0.38"
      {...props}
    >
      <defs>
        <filter
          id="bbblurry-filter"
          x="-100%"
          y="-100%"
          width="400%"
          height="400%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            stdDeviation="130"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="SourceGraphic"
            edgeMode="none"
            result="blur"
          />
        </filter>
      </defs>
      <g filter="url(#bbblurry-filter)">
        <ellipse
          rx="158.5"
          ry="214"
          cx="547.1072662659074"
          cy="550.3750485757874"
          fill="#2f27ce"
        />
      </g>
    </svg>
  )
}
