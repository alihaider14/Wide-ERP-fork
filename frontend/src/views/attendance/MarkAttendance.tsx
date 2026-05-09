import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { IconX } from "@tabler/icons-react";
import { FingerprintScan } from "@/assets/svg";
import useMarkAttendance from "@/hooks/useMarkAttendance";
import ManualAttendanceModal from "@/components/custom/ManualAttendanceModal";

const MarkAttendance = () => {
	const {
		scanModal,
		manualModal,
		manualData,
		employees,
		attendanceDateTime,
		attendanceTimeValue,
		errors,
		handleOpenScan,
		handleCloseScan,
		handleOpenManual,
		handleCloseManual,
		handleEmployeeSelect,
		handleMarkSelect,
		handleManualChange,
		handleAttendanceDateSelect,
		handleAttendanceTimeChange,
		handleManualSubmit,
		markOptions,
	} = useMarkAttendance();

	return (
		<div className="bg-grey-100 min-h-screen">
			<div className="px-5 md:px-[50px] flex justify-between items-center w-full h-[50px] bg-white border-b border-borderColor">
				<h1 className="text-semi-black font-semibold text-sm leading-[100%]">
					Mark Attendance
				</h1>
			</div>
			<div className="flex items-center justify-center h-[calc(100vh-50px)]">
				<div className="flex flex-col items-center gap-8 w-[438px]">
					<div className="flex gap-5">
						<Button
							className="w-[192px]"
							onClick={() => handleOpenScan("check_in")}
						>
							Check In
						</Button>
						<Button
							className="w-[192px]"
							onClick={() => handleOpenScan("check_out")}
						>
							Check Out
						</Button>
					</div>
					<div className="text-center h-[42px] flex flex-col justify-center gap-2">
						<p
							className="text-sm font-semibold leading-[100%] text-semi-black cursor-pointer hover:underline"
							onClick={handleOpenManual}
						>
							Manual marking — only for authorized person.
						</p>
						<p className="text-sm font-normal leading-[100%] text-semi-black">
							This will overwrite the attendance if already exists.
						</p>
					</div>
				</div>
			</div>

			<Dialog open={scanModal.open} onOpenChange={(open) => !open && handleCloseScan()}>
				<DialogContent
					className="w-[400px] h-[181px] rounded-[5px] p-5 gap-5"
					isCrossIcon={false}
				>
					<div className="flex items-center">
						<DialogTitle className="text-sm font-normal leading-[100%] text-center text-semi-black flex-1">
							Scan Fingerprint to mark{" "}
							<span className="font-semibold">
								{scanModal.mode === "check_in" ? "Check In" : "Check Out"}
							</span>
						</DialogTitle>
						<DialogClose onClick={handleCloseScan} className="cursor-pointer opacity-70 hover:opacity-100">
							<IconX className="size-5 text-grey" />
						</DialogClose>
					</div>
					<div className="flex justify-center">
						<FingerprintScan
							width={100}
							height={100}
							className="text-grey [&_path]:stroke-[1.3]"
						/>
					</div>
				</DialogContent>
			</Dialog>

			<ManualAttendanceModal
			  	errors={errors}
				open={manualModal}
				manualData={manualData}
				employees={employees}
				markOptions={markOptions}
				attendanceDateTime={attendanceDateTime}
				attendanceTimeValue={attendanceTimeValue}
				onClose={handleCloseManual}
				onEmployeeSelect={handleEmployeeSelect}
				onMarkSelect={handleMarkSelect}
				onChange={handleManualChange}
				onAttendanceDateSelect={handleAttendanceDateSelect}
				onAttendanceTimeChange={handleAttendanceTimeChange}
				onSubmit={handleManualSubmit}
			/>
		</div>
	);
};

export default MarkAttendance;
