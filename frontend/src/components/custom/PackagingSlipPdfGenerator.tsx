import { forwardRef, ReactNode, useImperativeHandle } from "react";
import {
	Document,
	Page,
	View,
	Text,
	Image,
	StyleSheet,
	pdf,
	Svg,
	Line,
} from "@react-pdf/renderer";

import { PDFGeneratorHandle, TPDFOrder } from "@/types/pdf";
import { generateBarcodePNG, generateQRCodePNG } from "@/helper/generate-codes";
import { numberFormateToLocalString } from "@/helper/number-formator";
import { COLOR } from "@/constant/Colors";
import { Font } from "@react-pdf/renderer";
import PoppinsRegular from "../../assets/fonts/Poppins-Regular.ttf";
import PoppinsBold from "../../assets/fonts/Poppins-Bold.ttf";
import PoppinsSemiBold from "../../assets/fonts/Poppins-SemiBold.ttf";

Font.register({
	family: "Custom",
	fonts: [
		{ src: PoppinsRegular, fontWeight: "normal" },
		{ src: PoppinsBold, fontWeight: "bold" },
		{ src: PoppinsSemiBold, fontWeight: 600 },
	],
});

Font.registerHyphenationCallback((word) => [word]);

type Props = {
	order: TPDFOrder[];
};

const styles = StyleSheet.create({
	page: {
		padding: 10,
		fontSize: 8,
		fontFamily: "Custom",
	},
	// ── HEADER ──────────────────────────────────────────────
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		minHeight: 48,
		width: "100%",
	},

	logo: {
		width: 48,
		height: 48,
		objectFit: "contain",
	},

	headerCenter: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
		paddingHorizontal: 16,
		flex: 1,
	},

	headerCenterText: {
		fontSize: 8,
		textAlign: "center",
	},

	headerRight: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},

	barcode: {
		width: 64,
		height: 24,
	},

	orderNumberText: {
		fontSize: 7,
		marginTop: 1,
	},

	// ── NOTE ────────────────────────────────────────────────
	note: {
		backgroundColor: COLOR.editBg,
		marginTop: 4,
		paddingHorizontal: 8,
		paddingVertical: 4,
		minHeight: 20,
	},

	noteText: {
		fontSize: 8,
		color: "#000",
	},

	noteBold: {
		fontWeight: 600,
	},

	// ── TABLE ───────────────────────────────────────────────
	tableHeader: {
		flexDirection: "row",
		backgroundColor: COLOR.borderColor,
		height: 20,
		alignItems: "center",
		paddingHorizontal: 4,
	},

	tableHeaderText: {
		fontSize: 8,

		fontWeight: 600,
		textTransform: "uppercase",
	},

	colItem: { width: "50%" },
	colPrice: { width: "15%", textAlign: "center" },
	colQty: { width: "15%", textAlign: "center" },
	colTotal: { width: "20%", textAlign: "center" },

	rowEven: {
		flexDirection: "row",
		alignItems: "center",
		height: 44,
		paddingHorizontal: 4,
		backgroundColor: "#FFFFFF",
	},

	rowOdd: {
		flexDirection: "row",
		alignItems: "center",
		height: 44,
		paddingHorizontal: 4,
		backgroundColor: "#F9FAFB",
	},

	productImageBox: {
		width: 40,
		height: 40,
		backgroundColor: COLOR.editBg,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},

	productImage: {
		width: 40,
		height: 40,
		objectFit: "cover",
	},

	productNoImage: {
		fontSize: 6,

		fontWeight: 600,
		color: COLOR.grey,
		textAlign: "center",
	},

	productInfo: {
		flexDirection: "column",
		justifyContent: "center",
		gap: 1,
		flex: 1,
		minWidth: 0,
	},

	productName: {
		fontSize: 8,
	},

	productSku: {
		fontSize: 8,
	},

	productSkuBold: {
		fontWeight: 600,
		fontSize: 8,
	},

	cellText: {
		fontSize: 8,
		textAlign: "center",
	},

	itemCell: {
		width: "50%",
		flexDirection: "row",
		alignItems: "center",
	},

	// ── TOTALS ──────────────────────────────────────────────
	totals: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: COLOR.borderColor,
		paddingHorizontal: 12,
		paddingVertical: 4,
		marginTop: 0,
	},

	totalText: {
		fontSize: 8,
	},

	totalTextBold: {
		fontSize: 8,
		fontWeight: 600,
	},

	// ── DASHED DIVIDER ──────────────────────────────────────
	dashedDivider: {
		marginVertical: 4,
	},

	// ── SHIPPING LABEL ──────────────────────────────────────
	shippingHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 31,
		width: "100%",
	},

	courierName: {
		fontSize: 16,
		fontWeight: 700,
	},

	shippingBarcodeBlock: {
		flexDirection: "column",
		alignItems: "center",
	},

	shippingBarcode: {
		width: 54,
		height: 20,
	},

	trackingBarcode: {
		width: 80,
		height: 20,
	},

	shippingBarcodeText: {
		fontSize: 7,

		marginTop: 1,
	},

	// ── COURIER TABLE ───────────────────────────────────────

	courierTable: {
		marginTop: 4,
		borderWidth: 1,
		borderColor: COLOR.borderColor,
		flexDirection: "column",
	},

	courierColumn: {
		flexDirection: "column",
		flexShrink: 0,
	},

	sectionHeaderText: {
		fontSize: 8,
		fontWeight: "600",
		textAlign: "center",
	},

	sectionHeaderWrapper: {
		height: 16,
		maxHeight: 16,
		backgroundColor: COLOR.borderColor,
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	courierLabel: {
		fontSize: 8,
	},

	courierValue: {
		fontSize: 8,
		fontWeight: 600,
	},

	courierQRLargeImage: {
		width: 108,
		height: 108,
	},

	smallQrCodeImage: {
		width: 60,
		height: 60,
	},
});

// ─── Dashed line component ───────────────────────────────────────────────────
const DashedDivider = () => (
	<View style={styles.dashedDivider}>
		<Svg height='4' width='100%'>
			<Line
				x1='0'
				y1='2'
				x2='595'
				y2='2'
				strokeWidth={1}
				stroke='#6B7280'
				strokeDasharray='4,3'
			/>
		</Svg>
	</View>
);

// ─── Courier table ───────────────────────────────────────────────────────────
const CourierTable = ({
	item,
	qrLargePng,
	qrSmallPng,
}: {
	item: TPDFOrder & { orderBarcode: string; trackingBarcode?: string | null };
	qrLargePng: string;
	qrSmallPng: string;
}) => {
	const si = item.shipmentInformation;
	const ci = item.consigneeInformation;
	const shi = item.shipperInformation;
	const oi = item.orderInformation;

	return (
		<View style={styles.courierTable}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "stretch",
				}}
			>
				<Section title='Consignee Information'>
					<CellPair label='Name' value={ci?.name || "-"} />
					<CellPair label='Contact' value={ci?.contact || "-"} />
					<CellPair
						label='Delivery Address'
						value={ci?.deliveryAddress || "-"}
						minHeight={28}
					/>
					<Section title='Shipper Information'>
						<CellPair label='Name' value={shi?.name || "-"} />
						<CellPair label='Contact' value={shi?.contact || "-"} />
						<CellPair
							label='Pickup Address'
							value={shi?.pickupAdress || "-"}
							minHeight={28}
						/>
						<CellPair
							label='Return Address'
							value={shi?.returnAdress || "-"}
							minHeight={28}
							flexGrow={1}
							borderBottom={false}
						/>
					</Section>
				</Section>

				<Section title='Shipment Information' maxWidth={180}>
					<CellPair label='Pieces' value={String(si?.pieces) || "-"} />
					<CellPair label='Origin' value={si?.origin || "-"} />
					<CellPair label='Destination' value={si?.destination || "-"} />
					<CellPair label='Return City' value={si?.returnCity || "-"} />
					<CellPair
						label='Remarks'
						value={si?.remarks || "-"}
						minHeight={40}
						flexGrow={1}
					/>

					<View
						style={{
							flexDirection: "row",
							borderRightWidth: 1,
							borderRightColor: COLOR.borderColor,
							minHeight: 60,
							alignItems: "center",
							width: "100%",
						}}
					>
						<Image src={qrSmallPng} style={styles.smallQrCodeImage} />

						<View
							style={{
								flex: 1,
								paddingVertical: 6,
								paddingHorizontal: 4,
								backgroundColor: COLOR.editBg,
							}}
						>
							<Text style={[styles.courierValue, { fontWeight: 500 }]}>
								Please refuse delivery if the package isn’t intact. COD orders
								can’t be opened before payment.
							</Text>
						</View>
					</View>
				</Section>

				<Section title='Order Information' flex={1}>
					<View
						style={{
							flexDirection: "row",
							borderBottomWidth: 1,
							borderBottomColor: COLOR.borderColor,
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							paddingVertical: 4,
						}}
					>
						<Image src={qrLargePng} style={styles.courierQRLargeImage} />
					</View>
					<CellPair
						label='Amount'
						value={String(oi?.amount) || "-"}
						borderRight={false}
					/>
					<CellPair
						label='Date'
						value={item?.orderDate || "-"}
						borderRight={false}
					/>
					<CellPair
						label='Order Type'
						value={oi?.orderType || "-"}
						borderRight={false}
						flexGrow={1}
						borderBottom={false}
					/>
				</Section>
			</View>

			{/* <CellPair
				label='Details'
				value={shi?.details || "-"}
				borderBottom={false}
				borderRight={false}
			/> */}
		</View>
	);
};

const Section = ({
	title,
	children,
	flex,
	maxWidth = 257,
}: {
	title: string;
	children: ReactNode;
	maxWidth?: number;
	flex?: number;
}) => (
	<View
		style={[
			styles.courierColumn,
			{
				...(flex
					? { flex }
					: {
							width: maxWidth,
							maxWidth: maxWidth,
							flexShrink: 0,
						}),
			},
			{ alignSelf: "stretch" },
		]}
	>
		<View style={styles.sectionHeaderWrapper}>
			<Text style={styles.sectionHeaderText}>{title}</Text>
		</View>

		{children}
	</View>
);

// ─── Helper: single label+value cell ────────────────────────────────────────
const CellPair = ({
	label,
	value,
	borderRight = true,
	borderBottom = true,
	minHeight = 16,
	flexGrow,
}: {
	label: string;
	value: string;
	minHeight?: number;
	flexGrow?: number;
	borderRight?: boolean;
	borderBottom?: boolean;
}) => (
	<View
		style={{
			flexDirection: "row",
			borderBottomWidth: borderBottom ? 1 : 0,
			borderBottomColor: COLOR.borderColor,
			borderRightWidth: borderRight ? 1 : 0,
			borderRightColor: COLOR.borderColor,
			minHeight: minHeight || "auto",
			alignItems: "flex-start",
			width: "100%",
			flexGrow: flexGrow,
		}}
	>
		<View
			style={{
				width: 60,
				borderRightWidth: 1,
				borderRightColor: COLOR.borderColor,
				justifyContent: "flex-start",
				padding: 2,
				height: "100%",
			}}
		>
			<Text style={styles.courierLabel}>{label}</Text>
		</View>
		<View style={{ flex: 1, padding: 2 }}>
			<Text style={styles.courierValue}>{value}</Text>
		</View>
	</View>
);

// ─── Main component ───────────────────────────────────────────────────────────
const PackagingSlipPdfGenerator = forwardRef<PDFGeneratorHandle, Props>(
	({ order }, ref) => {
		useImperativeHandle(ref, () => ({
			generatePDF: async () => {
				const ordersWithAssets = await Promise.all(
					order.map(async (item) => {
						const orderBarcode = await generateBarcodePNG(
							item.orderNumber || "",
						);
						const trackingBarcode = item.trackingId
							? await generateBarcodePNG(item.trackingId)
							: null;
						const qrLargePng = item.trackingId
							? await generateQRCodePNG(item.trackingId, 108)
							: null;
						const qrSmallPng = item.trackingId
							? await generateQRCodePNG(
									`${item.shopId}|${item.orderNumber}`,
									108,
								)
							: null;

						return {
							...item,
							orderBarcode,
							trackingBarcode,
							qrLargePng,
							qrSmallPng,
						};
					}),
				);

				const blob = await pdf(
					<Document>
						{ordersWithAssets.map((item, index) => (
							<Page size='A4' style={styles.page} key={index}>
								{/* ── HEADER ── */}
								<View style={styles.header}>
									{item?.storeLogo && (
										<Image src={item.storeLogo} style={styles.logo} />
									)}

									<View style={styles.headerCenter}>
										<Text
											style={[styles.headerCenterText, { fontWeight: 600 }]}
										>
											{[
												item?.storeName,
												item?.orderDate,
												item?.customerName,
												item?.phone,
											]
												.filter(Boolean)
												.join(" | ")}
										</Text>
										<Text
											style={[
												styles.headerCenterText,
												{ maxLines: 3, textOverflow: "ellipsis" },
											]}
										>
											{[item?.addressLine1, item?.addressLine2]
												.filter(Boolean)
												.join(" | ")}
										</Text>
										<Text style={styles.headerCenterText}>
											{[item?.city, item?.state].filter(Boolean).join(" | ")}
										</Text>
									</View>

									<View style={styles.headerRight}>
										<Image src={item.orderBarcode} style={styles.barcode} />
										<Text style={styles.orderNumberText}>
											{item?.orderNumber || "-"}
										</Text>
									</View>
								</View>

								{/* ── NOTE ── */}
								<View style={styles.note}>
									<Text style={styles.noteText}>
										Note:{" "}
										<Text style={styles.noteBold}>{item?.note || "-"}</Text>
									</Text>
								</View>

								{/* ── TABLE HEADER ── */}
								<View style={styles.tableHeader}>
									<Text style={[styles.tableHeaderText, styles.colItem]}>
										Items
									</Text>
									<Text style={[styles.tableHeaderText, styles.colPrice]}>
										Price
									</Text>
									<Text style={[styles.tableHeaderText, styles.colQty]}>
										Qty
									</Text>
									<Text style={[styles.tableHeaderText, styles.colTotal]}>
										Total
									</Text>
								</View>

								{/* ── PRODUCTS ── */}
								{item?.products?.map((product, i) => (
									<View
										style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}
										key={i}
										wrap={false}
									>
										<View style={styles.itemCell}>
											<View style={styles.productImageBox}>
												{product?.image ? (
													<Image
														src={product.image}
														style={styles.productImage}
													/>
												) : (
													<Text style={styles.productNoImage}>
														Product{"\n"}Image
													</Text>
												)}
											</View>
											<View style={styles.productInfo}>
												<Text style={styles.productName}>
													{product?.name || "-"}
												</Text>
												<Text style={styles.productSku}>
													SKU:{" "}
													<Text style={styles.productSkuBold}>
														{product?.sku || "-"}
													</Text>
												</Text>
											</View>
										</View>

										<Text style={[styles.cellText, styles.colPrice]}>
											Rs. {numberFormateToLocalString(product?.price || 0)}
										</Text>
										<Text style={[styles.cellText, styles.colQty]}>
											{product?.quantity || 0}
										</Text>
										<Text style={[styles.cellText, styles.colTotal]}>
											Rs.{" "}
											{numberFormateToLocalString(
												(product?.price || 0) * (product?.quantity || 0),
											)}
										</Text>
									</View>
								))}

								{/* ── TOTALS ── */}
								<View style={styles.totals} wrap={false}>
									<Text style={styles.totalText}>
										Subtotal: Rs.{" "}
										{numberFormateToLocalString(item?.subtotal || 0)}
									</Text>
									<Text style={styles.totalText}>
										Shipping: Rs.{" "}
										{numberFormateToLocalString(item?.shipping || 0)}
									</Text>
									<Text style={styles.totalText}>
										GST 4%: Rs.{" "}
										{numberFormateToLocalString(item?.gstAmount || 0)}
									</Text>
									<Text style={styles.totalTextBold}>
										Total: Rs. {numberFormateToLocalString(item?.total || 0)}
									</Text>
								</View>

								{/* ── SHIPPING LABEL ── */}
								{item?.trackingId && (
									<View wrap={false}>
										<DashedDivider />

										{/* Courier header row */}
										<View style={styles.shippingHeader}>
											<Text style={styles.courierName}>
												{item?.courierName || "COURIER"}
											</Text>

											<View style={styles.shippingBarcodeBlock}>
												<Image
													src={item.orderBarcode}
													style={styles.shippingBarcode}
												/>
												<Text style={styles.shippingBarcodeText}>
													{item?.orderNumber || "-"}
												</Text>
											</View>

											{item.trackingBarcode && (
												<View style={styles.shippingBarcodeBlock}>
													<Image
														src={item.trackingBarcode}
														style={styles.trackingBarcode}
													/>
													<Text style={styles.shippingBarcodeText}>
														{item?.trackingId || "-"}
													</Text>
												</View>
											)}
										</View>

										{/* Courier detail table */}
										{item.qrLargePng && item.qrSmallPng && (
											<CourierTable
												item={item}
												qrLargePng={item.qrLargePng}
												qrSmallPng={item.qrSmallPng}
											/>
										)}
									</View>
								)}
							</Page>
						))}
					</Document>,
				).toBlob();

				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "Packaging Slip.pdf";
				a.click();
				URL.revokeObjectURL(url);
			},
		}));

		return null;
	},
);

export default PackagingSlipPdfGenerator;
