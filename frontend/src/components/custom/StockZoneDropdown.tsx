import React from "react";
import { Label } from '../ui/label';
import { useQuery } from "@tanstack/react-query";
import { ChevronDowns } from "@/assets/svg";

type Props = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
};

const fetchStockZones = async () => {
    const res = await import("@/services/stock-zone-service");
    const zones = await res.getStockZones(1, 100, "");
    return zones.data || [];
};

const StockZoneDropdown: React.FC<Props> = ({ value, onChange, disabled }) => {
    const {
        data: stockZones = [],
        isLoading,
    } = useQuery({
        queryKey: ["stock-zones-dropdown"],
        queryFn: fetchStockZones,
    });

    return (
        <div className="flex flex-col gap-1">
            <Label>
                Stock Zone
            </Label>
            <div className="relative">
                <select
                    name="stock_zone_id"
                    id="stock_zone_id"
                    value={value}
                    onChange={onChange}
                    disabled={disabled || isLoading}
                    className="h-[36px] w-full rounded-[3px] border border-borderColor outline-none text-[14px] text-grey px-[15px] bg-transparent appearance-none focus:border-borderColor"
                >
                    <option value="" className="text-grey">
                        Select Stock Zone
                    </option>
                    {stockZones.map((zone: { _id: string; name: string }) => (
                        <option key={zone._id} value={zone._id}>
                            {zone.name}
                        </option>
                    ))}
                </select>
                <img
                  src={ChevronDowns}
                  alt="chevron-down"
                  className="absolute right-[12px] top-[11px] w-[14px] h-[14px] opacity-100 pointer-events-none"
                />
            </div>
        </div>
    );
};

export default StockZoneDropdown;