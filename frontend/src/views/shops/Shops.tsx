import { Layout, CustomTable, CustomLoader, TableRowLoader } from "@/components";
import { TableCell, TableRow } from "@/components/ui/table";
import useShops from "@/hooks/useShops";
import { SHOPS_HEAD_DATA } from "@/constant/tableData";
import { useNavigate } from "react-router-dom";
import ShopsTableRow from "@/components/custom/ShopsTableRow";

const Shops = () => {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    pageNo,
    pageSize,
    handleChangePageSize,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    paginatedData,
    totalRows,
    totalPages,
    handleDeleteShop,
    hoveredRow,
    setHoveredRow,
    isTableLoader,
    isCustomerLoader,
  } = useShops();

  return (
    <Layout headerTitle="Shops">
      <CustomLoader isLoading={isCustomerLoader} />
      <CustomTable
        head={SHOPS_HEAD_DATA}
        searchValue={search}
        onChangeSearch={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search"
        buttonLabel="+ Add Shop"
        onClickButton={() => navigate("/add-shop")}
        handleChangePageSize={handleChangePageSize}
        pageSize={pageSize}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleFirstPage={handleFirstPage}
        handleLastPage={handleLastPage}
        disabledPagination={{
          first: pageNo === 1,
          prev: pageNo === 1,
          next: pageNo === totalPages || totalPages === 0,
          last: pageNo === totalPages || totalPages === 0,
        }}
        remaining={`${(pageNo - 1) * pageSize + 1}-${Math.min(
          pageNo * pageSize,
          totalRows
        )} of ${totalRows}`}
      >
        {isTableLoader ? (
          <TableRowLoader rowsNum={10} cellsNum={SHOPS_HEAD_DATA.length} />
        ) : paginatedData.length > 0 ? (
          paginatedData.map((shop) => {
            const isHovered = hoveredRow === String(shop._id);
            return (
              <ShopsTableRow
                key={shop._id}
                shop={shop}
                isHovered={isHovered}
                onMouseEnter={() => setHoveredRow(String(shop._id))}
                onMouseLeave={() => setHoveredRow(null)}
                onEdit={() => navigate(`/update-shop/${shop._id}`)}
                onDelete={() => handleDeleteShop(shop._id)}
              />
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={SHOPS_HEAD_DATA.length} className="text-center">
              No Shops Found
            </TableCell>
          </TableRow>
        )}
      </CustomTable>
    </Layout>
  );
};
export default Shops;
