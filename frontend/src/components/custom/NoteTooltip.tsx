import { ReactNode } from "react";
import { Tooltip } from "react-tooltip";

type NoteTooltipProps = {
  tooltipId: string;
  note: string;
  children: ReactNode;
};

const NoteTooltip = ({ tooltipId, note, children }: NoteTooltipProps) => {
  return (
    <>
      <span className='inline-flex items-center' data-tooltip-id={tooltipId}>
        {children}
      </span>
      <Tooltip
        id={tooltipId}
        place='right-end'
        offset={8}
        noArrow
        className='z-[9999] h-auto min-h-0 translate-y-[10px] shadow-[0px_4px_4px_0px_#0000001A] !bg-background !text-semi-black border !border-borderColor rounded-[5px] p-2 w-[386px] max-w-[calc(100vw-24px)] opacity-100 overflow-hidden'
        render={() => (
          <div className='font-[Poppins] font-normal text-sm leading-[21px] tracking-normal whitespace-pre-line break-words align-middle'>
            {note}
          </div>
        )}
        style={{ "--rt-opacity": "1" } as React.CSSProperties}
      />
    </>
  );
};

export default NoteTooltip;

