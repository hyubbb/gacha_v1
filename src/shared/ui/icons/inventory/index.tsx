import type { IcDefaultProps } from '@/shared/ui/icons/types';

export function IcInventory({
  width = 24,
  height = 24,
  hexColor = '#000',
  themeColor
}: IcDefaultProps) {
  const color = themeColor ? `rgb(var(--c-${themeColor}))` : hexColor;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M5 3.59961H15C15.7732 3.59961 16.4004 4.2268 16.4004 5V15C16.4004 15.7732 15.7732 16.4004 15 16.4004H5C4.2268 16.4004 3.59961 15.7732 3.59961 15V5C3.59961 4.2268 4.2268 3.59961 5 3.59961Z"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  );
}
