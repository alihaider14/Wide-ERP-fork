import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ChangeEvent } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { COLOR } from "@/constant/Colors";
import { TManualAttendance, MarkType, TEmployeeOption } from "@/types/Attendance";
import CustomDatePicker from "@/components/custom/CustomDatePicker";
import CustomAutocomplete, { TAutocomplete } from "@/components/custom/CustomAutocomplete";
import { MANUAL_ATTENDANCE_DATE_TIME_FORMAT } from "@/constant/Date";

interface ManualAttendanceModalProps {
	open: boolean;
	manualData: TManualAttendance;
	employees: TEmployeeOption[];
	markOptions: TAutocomplete[];
	attendanceDateTime?: Date;
	attendanceTimeValue: string;
	onClose: () => void;
	onEmployeeSelect: (id: string) => void;
	onMarkSelect: (value: MarkType) => void;
	onChange: (
		field: keyof TManualAttendance,
	) => (e: ChangeEvent<HTMLInputElement>) => void;
	onAttendanceDateSelect: (date?: Date) => void;
	onAttendanceTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onSubmit: () => void;
	errors: Record<string, string>;
}

const ManualAttendanceModal = ({
	open,
	manualData,
	employees,
	markOptions,
	attendanceDateTime,
	attendanceTimeValue,
	errors,
	onClose,
	onEmployeeSelect,
	onMarkSelect,
	onChange,
	onAttendanceDateSelect,
	onAttendanceTimeChange,
	onSubmit,
}: ManualAttendanceModalProps) => {
	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogContent className="sm:max-w-[400px] rounded-[5px] p-5 gap-5" isCrossIcon={false}>
				<DialogHeader className="relative flex items-center justify-center h-[21px]">
					<DialogTitle className="text-center text-sm leading-[21px] font-normal">
						<span className="font-semibold">Attendance</span> will be overwrite, if exists
					</DialogTitle>
					<DialogPrimitive.Close className="absolute right-0 cursor-pointer opacity-70 hover:opacity-100">
						<X className="size-5" color={COLOR.grey} />
					</DialogPrimitive.Close>
				</DialogHeader>

				<div className="w-[350px] mx-auto flex flex-col gap-5">
					<div className="flex flex-col gap-1">
						<Label>
							Employee <span style={{ color: COLOR.red }}>*</span>
						</Label>
						<CustomAutocomplete
							data={employees}
							value={manualData.employee_id}
							handleSelect={(item) => onEmployeeSelect(item.id)}
							placeholder="Select Employee"
							dropdownClassName="w-[350px] h-[148px] rounded-[4px] border-borderColor p-0 gap-0 shadow-[0px_4px_4px_0px_#0000001A]"
							itemClassName="h-[37px] gap-2.5 border-b-[0.5px] border-borderColor/50 p-2 rounded-none last:border-b-0"
						/>
            {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
					</div>

					<div className="flex flex-col gap-1">
						<Label>
							Mark <span style={{ color: COLOR.red }}>*</span>
						</Label>
						<CustomAutocomplete
							data={markOptions}
							value={manualData.mark}
							handleSelect={(item) => onMarkSelect(item.id as MarkType)}
							placeholder="Select Mark"
							dropdownClassName="w-[350px] h-[148px] rounded-[4px] border-borderColor p-0 gap-0 shadow-[0px_4px_4px_0px_#0000001A]"
							itemClassName="h-[37px]  gap-2.5 border-b-[0.5px] border-borderColor/50 p-2 rounded-none last:border-b-0"
						/>
            {errors.mark && <p className="text-red-500 text-xs mt-1">{errors.mark}</p>}
					</div>

					<div className="flex flex-col gap-1">
						<CustomDatePicker
							name="attendance_date_time"
							label="Attendance Date Time"
							required
							date={attendanceDateTime}
							onDateChange={onAttendanceDateSelect}
							displayFormat={MANUAL_ATTENDANCE_DATE_TIME_FORMAT}
							placeholder={"Feb 1, 2026 \u2014 09:00 AM"}
							timeLabel=""
							timeValue={attendanceTimeValue}
							onTimeChange={onAttendanceTimeChange}
							className="w-full"
						/>
						{errors.attendance_date_time && <p className="text-red-500 text-xs mt-1">{errors.attendance_date_time}</p>}
					</div>

					<Input
						label="Note"
						placeholder="Something to remember..."
						value={manualData.note}
						onChange={onChange("note")}
						className="pl-4"
					/>

					<Button className="w-full" onClick={onSubmit}>
						Submit
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ManualAttendanceModal;
