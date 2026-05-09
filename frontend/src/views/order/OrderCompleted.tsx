import { CompletedCheck } from "@/assets/svg";
import { Layout, PageHeader } from "@/components";
import { Button } from "@/components/ui/button";
import useOrderCompleted from "@/hooks/useOrderCompleted";

const OrderCompleted = () => {
	const {
		_id,
		isBtnDisabled,
		count,
		changeDue,
		navigate,
		handleReprintReceipt
	} = useOrderCompleted();

	return (
		<Layout>
			<PageHeader
				heading="Order Reciept"
				isbackIcon
				backButtonText="Back to Orders"
				onClickBack={() => navigate("/orders")}
				subHeading="Edit Order"
				onClickSubHeading={() => navigate(`/update-order/${_id}`)}
			/>
			<div className="flex items-center justify-center sm:h-[80%]">
				<div className="w-full max-w-[700px] bg-white border border-border rounded-[5px]  py-[60px] sm:p-10 flex flex-col items-center px-3 md:px-5  ">
					<img
						src={CompletedCheck}
						alt="CompletedCheck"
						width={100}
						height={100}
					/>

					<span className="font-semibold text-[32px]  text-parrot mt-4 mb-5 text-center">
						Order Created Successfully!
					</span>

					<span className="font-semibold text-[32px]  text-foreground  mb-[50px] text-center">
						{`Change Due Rs ${changeDue || 0}`}
					</span>

					<Button
						variant={isBtnDisabled ? "secondary" : "default"}
						onClick={handleReprintReceipt}
						disabled={isBtnDisabled}
						className="w-full max-w-[350px]"
					>
						{isBtnDisabled
							? `Re-print Receipt in ${count}s...`
							: "Re-print Receipt"}
					</Button>
				</div>
			</div>
		</Layout>
	);
};

export default OrderCompleted;
