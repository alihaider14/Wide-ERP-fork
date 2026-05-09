import { Trash } from "@/assets/svg";
import { COLOR } from "@/constant/Colors";
import { BILL_FORM_HEAD_DATA } from "@/constant/tableData";
import { handleApiError } from "@/helper/error-function";
import { numberFormateToLocalString } from "@/helper/number-formator";
import { useDebounce } from "@/hooks/useDebounce";
import { getProducts } from "@/services/product-service";
import { BillCreateInput, BillItemInput } from "@/types/bill";
import { TError } from "@/types/TError";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TableCell, TableRow } from "../ui/table";
import CustomAutocomplete from "./CustomAutocomplete";
import CustomDatePicker from "./CustomDatePicker";
import SearchInput from "./SearchInput";
import SimpleTable from "./SimpleTable";
import TableIcon from "./TableIcon";
type TProps = {
  onChange?: <K extends keyof BillCreateInput>(
    field: K,
    value: BillCreateInput[K],
  ) => void;
  data?: Partial<BillCreateInput>;
  addItem: (item: BillItemInput) => void;
  removeItem: (index: number) => void;
  items: BillItemInput[];
  updateItem: (index: number, updated: Partial<BillItemInput>) => void;
  handleCheckout?: () => void;
  setBillData?: (data: Partial<BillCreateInput>) => void;
  setItems?: (items: BillItemInput[]) => void;
  disabledBtn?: boolean;
  vendors: Array<{_id?: string; full_name: string}>;
  isVendorsLoading?: boolean;
  isUpdate?: boolean;
};
const BillForm = ({
  onChange,
  data,
  addItem,
  removeItem,
  items,
  updateItem,
  handleCheckout,
  disabledBtn,
  vendors,
  isVendorsLoading,
  isUpdate = false,
}: TProps) => {
  const ROW_ACTIVE_BG = "#FAFAFA";
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debounceSearch = useDebounce(search);
  const totalQty = items.reduce((sum, i) => {
    const qty = Number.isFinite(i.qty) ? i.qty : 0;
    return sum + Math.max(0, Math.floor(qty));
  }, 0);

  const {
    data: availableProducts,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["productsForBill", 1, 10, undefined, debounceSearch],
    queryFn: () => getProducts(1, 10, "active", undefined, debounceSearch),
    enabled: !!isFocused && Boolean(debounceSearch.length > 2),
  });

  if (isError)
    handleApiError(error as unknown as TError, "Oops! something went wrong");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused || !availableProducts?.products?.length) return;
      if (e.key === "ArrowDown") {
        setSelectedIndex((prevIndex) =>
          prevIndex < availableProducts!.products.length - 1
            ? prevIndex + 1
            : 0,
        );
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prevIndex) =>
          prevIndex > 0
            ? prevIndex - 1
            : availableProducts!.products.length - 1,
        );
      } else if (e.key === "Enter") {
        const product = availableProducts.products[selectedIndex];
        addItem({
          product: product._id,
          cost: NaN,
          qty: 1,
          total_price: 0,
          sku: product.sku || "",
          barcode: product.barcode || "",
        });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, selectedIndex, availableProducts, addItem]);

  return (
    <div className="w-full bg-white border border-border rounded-[5px]">
      <div className="flex lg:flex-row flex-col items-end justify-between py-5 px-5 md:px-10 gap-x-10 gap-y-5 flex-wrap">
        <div className="flex lg:flex-row flex-col lg:items-center gap-5 w-full lg:w-auto flex-wrap">
          <CustomAutocomplete
		  className="lg:min-w-72 placeholder:text-grey"
            data={
              vendors?.map((vendor) => ({
                id: vendor._id || "",
                name: vendor.full_name,
              })) || []
            }
            placeholder="Vendor"
            label="Vendor"
            name="vendor"
			disabled={isVendorsLoading}
            value={data?.vendor || ""}
            handleSelect={(item) => {
              if (onChange) onChange("vendor", item.id);
            }}
          />

          <CustomDatePicker
            name="bill_date"
            label="Date"
            date={data?.bill_date}
            onDateChange={(date) => {
              if (onChange) onChange("bill_date", date);
            }}
          />
        </div>
        <Button
          className="w-[192px] h-9 rounded-[3px] text-white bg-primaryDarkBlue shadow-none flex items-center justify-center opacity-100"
          onClick={handleCheckout}
          disabled={disabledBtn}
        >
          {isUpdate ? "Update Bill" : "Create Bill"}
        </Button>
      </div>
      <div className="border-t border-border">
        <div className="h-[60px] py-3 px-5 md:px-10 flex items-center justify-center bg-grey-100 relative">
          <div className="w-full">
            <SearchInput
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product by SKU or Barcode"
              className="w-full h-9"
              inputClassName="placeholder:text-grey"
              isFocusButtons
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />

            <div
              className={`absolute flex flex-col left-5 md:left-10  top-14 lg:min-h-[600px] w-[80%] lg:max-w-[650px] border-border border shadow-[0_4px_8px_3px] shadow-shadow rounded-[5px] bg-white z-50  overflow-auto
					transition-all duration-300 ${
            Boolean(debounceSearch.length > 2) && isFocused
              ? "opacity-100 scale-y-100"
              : "opacity-0 scale-y-0"
          }
				`}
              onMouseDown={(e) => e.preventDefault()}
            >
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center flex-1 p-5 md:p-10">
                  <ScaleLoader loading color={COLOR.blue} />
                </div>
              ) : availableProducts?.products?.length ? (
                availableProducts.products.map((item, index) => (
               <div
                key={item._id}
                className={`flex items-center h-[60px] cursor-pointer border-b border-border/50 last:border-b-0 py-1 px-5 md:px-10 group ${
                 selectedIndex === index ? `bg-[${ROW_ACTIVE_BG}]` : `hover:bg-[${ROW_ACTIVE_BG}]`
               }`}
               onClick={() => {
               addItem({
               product: item._id,
               cost: NaN,
               qty: 1,
               total_price: 0,
               sku: item.sku || "",
               barcode: item.barcode || "",
             });
            }}
            >
           <div className="flex w-full items-center">
             <div className="flex items-center gap-5 w-[420px]">
               <div className="flex-1 text-sm font-normal leading-[100%]">
                 {item.sku || ""}
               </div>
               <div className="text-sm font-normal leading-[100%]">
                 Qty: 1
               </div>
             </div>
                 <div className="ml-auto">
               <Button
                 variant="ghostSecondary"
                 className={`text-xs font-normal h-6 w-[50px] px-0 py-0 rounded-[3px] border border-border bg-[${ROW_ACTIVE_BG}] transition-all duration-300
                 ${
                       selectedIndex === index
                                ? "opacity-100 visible delay-200"
                                : "opacity-0 invisible"
                            }
                            group-hover:opacity-100 group-hover:visible`}
                        tabIndex={-1}
                      >
                        Enter
                      </Button>
                    </div>
                  </div>
                </div>
                ))): (
                <div className="w-full h-full flex items-center justify-center flex-1 p-5 md:p-10 text-gray-500">
                  No SKU found
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <SimpleTable head={BILL_FORM_HEAD_DATA}>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-5 md:pl-10 font-medium w-[32%] min-w-[120px] text-left">
                    {item.sku ||
                      availableProducts?.products?.find(
                        (p) => p._id === item.product,
                      )?.sku ||
                      "N/A"}
                  </TableCell>
                  <TableCell className="w-[17%] min-w-[120px] ">
                    <Input
                      placeholder='Cost'
											name='cost'
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = Math.max(0, Number(e.target.value));
                        updateItem(index, {
													cost: Number(value.toFixed(0)),
                          total_price: Number((value * item.qty).toFixed(0)),
                        });
                      }}
                      value={
												!isNaN(item.cost)
													? item.cost.toFixed(0)
                          : ""
                      }
                      type="number"
                      min={0}
                      className="h-[30px] py-1.5 font-medium placeholder:font-normal placeholder:text-grey rounded-[3px] border border-border focus-visible:ring-2 focus-visible:ring-blue-500 transition-all w-full max-w-[120px]"
                    />
                  </TableCell>
                  <TableCell className="w-[17%] min-w-[120px] ">
                    <Input
                      placeholder="Qty"
                      name="qty"
                      onKeyDown={(e) => {
                        if (e.key === "." || e.key === "," || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        let value = Number(e.target.value);

                        value = Math.floor(value);

                        if (value < 1) value = 1;

                        if (value < 1) value = 1;

                        updateItem(index, {
                          qty: value,
													total_price: item.cost * value,
                        });
                      }}
                      value={item.qty || ""}
                      type="number"
                      min={1}
                      className="h-[30px] py-1.5 font-medium placeholder:font-normal placeholder:text-grey rounded-[3px] border border-border focus-visible:ring-2 focus-visible:ring-blue-500 transition-all w-full max-w-[120px]"
                    />
                  </TableCell>
                  <TableCell className="w-[17%] min-w-[120px]">
                    <Input
											placeholder='Total Cost'
											name='total_price'
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = Math.max(0, Number(e.target.value));

                        updateItem(index, {
                          total_price: isNaN(value) ? 0 : Math.round(value),
												cost:
                            isNaN(value) || !item.qty
                              ? 0
                              : Math.round(value / item.qty),
                        });
                      }}
                      value={
                        !isNaN(item.total_price) && !isNaN(item.cost)
                          ? Math.round(item.total_price).toString()
												: item.cost && !isNaN(item.cost) && item.qty
													? Math.round(item.cost * item.qty).toString()
                            : ""
                      }
                      type="number"
                      min={0}
                      className="h-[30px] py-1.5 font-medium placeholder:font-normal placeholder:text-grey rounded-[3px] border border-border focus-visible:ring-2 focus-visible:ring-blue-500 transition-all w-full max-w-[120px]"
                    />
                  </TableCell>
                  <TableCell className="w-[20%] min-w-[80px] flex items-center justify-center h-[60px]">
                    <TableIcon
                      src={Trash}
                      alt="Trash"
                      tooltipId="delete-tooltip"
                      data-tooltip-content="Delete"
                      onClick={() => {
                        if (
                          isUpdate &&
                          item.remaining_qty !== undefined &&
                          item.qty !== item.remaining_qty
                        ) {
                          toast.error(
                            `Cannot remove product that has sold items. ${
                              item.qty - item.remaining_qty
                            } items have been sold.`
                          );
                          return;
                        }
                        removeItem(index);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={BILL_FORM_HEAD_DATA.length}
                  className="text-center"
                >
                  Select products to create a bill.
                </TableCell>
              </TableRow>
            )}
          </SimpleTable>
          <div className="border-t border-border min-h-[60px] text-sm text-secondary-foreground rounded-b-[5px] bg-grey-100 flex flex-row flex-wrap gap-y-3 gap-x-5 items-center justify-between text-nowrap px-5 md:px-10">
            <span className="font-medium  text-gray-500">
              Items. {totalQty}
            </span>
            <span className="font-medium text-[20px] text-foreground">
              Total:{" "}
              {numberFormateToLocalString(
                items.reduce(
                  (sum, i) =>
                    sum +
                    (i.total_price || 0),
                  0,
                ),
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BillForm;
