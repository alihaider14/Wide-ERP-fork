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
import { generateQRCodePNG } from "@/helper/generate-codes";
import { Font } from "@react-pdf/renderer";
import PoppinsRegular from "../../assets/fonts/Poppins-Regular.ttf";
import PoppinsBold from "../../assets/fonts/Poppins-Bold.ttf";
import PoppinsSemiBold from "../../assets/fonts/Poppins-SemiBold.ttf";
import { TPrintScannedOrder } from "@/types/shopify";

Font.register({
	family: "Custom",
	fonts: [
		{ src: PoppinsRegular, fontWeight: "normal" },
		{ src: PoppinsBold, fontWeight: "bold" },
		{ src: PoppinsSemiBold, fontWeight: 600 },
	],
});

type Props = {
	order: TPrintScannedOrder;
};

const styles = StyleSheet.create({
	page: {
		padding: 15,
		fontSize: 8,
		fontFamily: "Custom",
	},

	topHeader: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		gap: 10,
		marginBottom: 10,
	},
	topHeaderText: {
		fontSize: 12,
		fontWeight: 600,
		textAlign: "center",
	},

	divider: {
		width: 10,
		height: 2,
		backgroundColor: "#000",
	},

	header: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#e4e6eb",
		paddingHorizontal: 10,
		gap: 10,
		minHeight: 30,
		marginBottom: 8,
	},

	shopText: {
		fontWeight: 600,
		fontSize: 10,
	},

	printText: {
		textDecoration: "underline",
		fontSize: 9,
	},

	qrContainer: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: 16,
	},

	qrItem: {
		flexDirection: "column",
		gap: 4,
		alignItems: "center",
	},

	qrImage: {
		width: 100,
		height: 100,
	},

	trackingText: {
		fontSize: 8,
		textAlign: "center",
		fontWeight: 400,
	},
});

// ─── Main component ───────────────────────────────────────────────────────────
const ScannedOrderPdfGenerator = forwardRef<PDFGeneratorHandle, Props>(
	({ order }, ref) => {
		useImperativeHandle(ref, () => ({
			generatePDF: async () => {
				const data = await Promise.all(
					Object.entries(order).map(async ([shopName, trackingIds]) => {
						const data = await Promise.all(
							trackingIds.map(async (item) => {
								const trackingIdQRCode = item
									? await generateQRCodePNG(item, 100)
									: null;

								return {
									trackingId: item,
									trackingIdQRCode,
								};
							}),
						);

						return {
							shopName,
							data,
						};
					}),
				);

				const blob = await pdf(
					<Document>
						<Page size='A4' style={styles.page}>
							<View style={styles.topHeader}>
								<Text style={styles.topHeaderText}>
									Total Parcels:{" "}
									{Object.values(order).reduce(
										(acc, curr) => acc + curr.length,
										0,
									)}
								</Text>

								<View style={styles.divider} />
								<Text style={[styles.topHeaderText, { fontWeight: 400 }]}>
									{new Date()
										.toLocaleDateString("en-US", {
											weekday: "short",
											month: "short",
											day: "2-digit",
											year: "numeric",
										})
										.replace(",", "")}
								</Text>
							</View>

							{data.map((item, index) => (
								<View key={index} break={index !== 0}>
									<View style={styles.header}>
										<Text style={styles.shopText}>{item.shopName}</Text>

										<Text style={{ fontWeight: 400 }}>
											Count: {item.data.length}
										</Text>
									</View>

									<View style={styles.qrContainer}>
										{item.data.map((qr, i) => (
											<View key={i} style={styles.qrItem} wrap={false}>
												{qr.trackingIdQRCode && (
													<Image
														src={qr.trackingIdQRCode}
														style={styles.qrImage}
													/>
												)}
												<Text style={styles.trackingText}>{qr.trackingId}</Text>
											</View>
										))}
									</View>
								</View>
							))}
						</Page>
					</Document>,
				).toBlob();

				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "Scanned Order Slip.pdf";
				a.click();
				URL.revokeObjectURL(url);
			},
		}));

		return null;
	},
);

export default ScannedOrderPdfGenerator;
