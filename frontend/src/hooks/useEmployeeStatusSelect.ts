import { useState } from "react";
import { TEmployeeStatus, TEmployeeStatusSelectProps } from "@/types/Employee";

const useEmployeeStatusSelect = ({ status, onChange }: TEmployeeStatusSelectProps) => {
	const [open, setOpen] = useState(false);

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
	};

	const handleStatusClick = (nextStatus: TEmployeeStatus) => {
		setOpen(false);

		if (nextStatus === status) {
			return;
		}

		onChange(nextStatus);
	};

	return {
		open,
		handleOpenChange,
		handleStatusClick,
	};
};

export default useEmployeeStatusSelect;
