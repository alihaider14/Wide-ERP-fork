import { forwardRef, useImperativeHandle } from "react";
import {
	Document,
	Page,
	View,
	Text,
	Image,
	StyleSheet,
	pdf,
} from "@react-pdf/renderer";
import { PDFGeneratorHandle } from "@/types/pdf";
import { Font } from "@react-pdf/renderer";
import PoppinsRegular from "../../assets/fonts/Poppins-Regular.ttf";
import PoppinsBold from "../../assets/fonts/Poppins-Bold.ttf";
import PoppinsSemiBold from "../../assets/fonts/Poppins-SemiBold.ttf";
import { TPrintProducts } from "@/types/Products";
import { COLOR } from "@/constant/Colors";
import { PhotoImage } from "@/assets/images";

Font.register({
	family: "Custom",
	fonts: [
		{ src: PoppinsRegular, fontWeight: "normal" },
		{ src: PoppinsBold, fontWeight: "bold" },
		{ src: PoppinsSemiBold, fontWeight: 600 },
	],
});

type Props = {
	product: TPrintProducts[];
};

const styles = StyleSheet.create({
	page: {
		paddingVertical: 20,
		paddingHorizontal: 85,
		fontSize: 8,
		fontFamily: "Custom",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 20,
	},
	productCard: {
		flexDirection: "column",
		gap: 4,
	},
	productImageContainer: {
		width: 200,
		height: 200,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: COLOR.borderColor,
		backgroundColor: COLOR.secondaryGrey,
		overflow: "hidden",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	productImage: {
		width: 200,
		height: 200,
		objectFit: "cover",
		borderRadius: 4,
	},
	productPlaceholder: {
		width: 200,
		height: 200,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	productText: {
		fontWeight: 400,
		color: COLOR.semiBlack,
		fontSize: 11,
		maxWidth: 200,
	},
});

const ProductPdfGenerator = forwardRef<PDFGeneratorHandle, Props>(
	({ product }, ref) => {
		useImperativeHandle(ref, () => ({
			generatePDF: async () => {
				const blob = await pdf(
					<Document>
						<Page size='A4' style={styles.page}>
							<View style={styles.grid}>
								{product.map((item, index) => (
									<View key={index} style={styles.productCard} wrap={false}>
										<View style={styles.productImageContainer}>
											{item.image ? (
												<Image src={item.image} style={styles.productImage} />
											) : (
												<View style={styles.productPlaceholder}>
													<Image
														src={PhotoImage}
														style={{
															width: 50,
															height: 50,
															objectFit: "contain",
														}}
													/>
												</View>
											)}
										</View>

										<Text style={styles.productText}>{item.name}</Text>
										<Text style={styles.productText}>Quantity: {item.qty}</Text>
									</View>
								))}
							</View>
						</Page>
					</Document>,
				).toBlob();

				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "Product PDF.pdf";
				a.click();
				URL.revokeObjectURL(url);
			},
		}));

		return null;
	},
);

export default ProductPdfGenerator;