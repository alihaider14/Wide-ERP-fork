import {
	CustomLoader,
	Layout,
	OrderForm,
	PageHeader,
	Prompt,
} from "@/components";
import useUpdateOrder from "@/hooks/useUpdateOrder";

const UpdateOrder = () => {
	const {
		prompt,
		cart,
		orderData,
		isLoading,
		setPrompt,
		onAddToCart,
		onUpdateCartQty,
		setOrderData,
		handleChange,
		handleUpdateOrder,
		navigate,
		onDeleteToCart,
		isDataUnchanged,
		onUpdateCartItem,
	} = useUpdateOrder();

	return (
		<Layout>
			<CustomLoader isLoading={isLoading} />

			<PageHeader
				heading='Order'
				isbackIcon
				backButtonText='Back to Orders'
				onClickBack={() =>
					isDataUnchanged ? navigate("/orders") : setPrompt(true)
				}
				subHeading='Save as draft'
				onClickSubHeading={() => handleUpdateOrder("drafted")}
			/>

			<Prompt
				open={prompt}
				title='Back to Orders'
				description='Would you like to save the order as draft?'
				handleSumbit={() => {
					setPrompt(false);
					handleUpdateOrder("drafted");
				}}
				handleCancel={() => {
					setPrompt(false);
					navigate("/orders");
				}}
				cancelButtonText='No, delete the order'
				sumbitButtonText='Yes, save as draft'
			/>

			<OrderForm
				cart={cart}
				onAddToCart={onAddToCart}
				onUpdateCartQty={onUpdateCartQty}
				onChange={handleChange(setOrderData)}
				data={orderData}
				handleCheckout={() => handleUpdateOrder("completed")}
				onDeleteToCart={onDeleteToCart}
				disabledBtn={isDataUnchanged}
				onUpdateCartItem={onUpdateCartItem}
			/>
		</Layout>
	);
};

export default UpdateOrder;
