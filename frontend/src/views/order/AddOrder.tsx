import {
	CustomLoader,
	Layout,
	OrderForm,
	PageHeader,
	Prompt,
} from "@/components";
import useAddOrder from "@/hooks/useAddOrder";
import { useNavigate } from "react-router-dom";

const AddOrder = () => {
	const navigate = useNavigate();
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
		handleAddOrder,
		onDeleteToCart,
		onUpdateCartItem,
	} = useAddOrder();

	return (
		<Layout>
			<CustomLoader isLoading={isLoading} />

			<PageHeader
				heading='Order'
				isbackIcon
				backButtonText='Back to Orders'
				onClickBack={() => setPrompt(true)}
				subHeading='Save as draft'
				onClickSubHeading={() => handleAddOrder("drafted")}
			/>

			<Prompt
				open={prompt}
				title='Back to Orders'
				description='Would you like to save the order as draft?'
				handleSumbit={() => {
					setPrompt(false);
					handleAddOrder("drafted");
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
				handleCheckout={() => handleAddOrder("completed")}
				onDeleteToCart={onDeleteToCart}
				onUpdateCartItem={onUpdateCartItem}
			/>
		</Layout>
	);
};

export default AddOrder;
