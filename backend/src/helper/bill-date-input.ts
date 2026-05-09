export const createBillDateInput = (bill_date:Date) => {
    const billDateInput = new Date(bill_date);
    const billDateUtc = new Date(
        Date.UTC(
        billDateInput.getFullYear(),
        billDateInput.getMonth(),
        billDateInput.getDate(),
        0, 0, 0, 0,
    ),
);
    return billDateUtc;
}