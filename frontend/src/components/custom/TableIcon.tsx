import { cn } from '@/lib/utils';
import { Tooltip } from 'react-tooltip';

import { ReactNode } from 'react';
type TProps = {
  src?: string;
  alt?: string;
  iconComponent?: ReactNode;
  className?: string;
  onClick?: () => void;
  disabledBtn?: boolean;
  tooltipId: string;
} & React.HTMLAttributes<HTMLButtonElement>;

const TableIcon = ({
  src,
  alt,
  iconComponent,
  className,
  onClick,
  disabledBtn,
  tooltipId,
  ...rest
}: TProps) => {
  return (
    <button
      {...rest}
      className={cn(
        'size-10 rounded-full flex justify-center items-center cursor-pointer',
        className,
        disabledBtn && 'pointer-events-none opacity-50'
      )}
      data-tooltip-id={tooltipId}
      disabled={disabledBtn}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {iconComponent ? (
        iconComponent
      ) : (
        <img src={src} alt={alt} width={24} height={24} />
      )}
      <Tooltip id={tooltipId} />
    </button>
  );
};

export default TableIcon;
