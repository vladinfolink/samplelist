import React, { useState } from "react";
import { Button, Space, Checkbox } from "antd";
import s from "./ProductListing.module.css";

interface StatusOption {
  label: string;
  value: string;
}

interface FilterMenuProps {
  initialFilters: string[];
  statusOptions: StatusOption[];
  onApply: (filters: string[]) => void;
  onClose: () => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  initialFilters,
  statusOptions,
  onApply,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<string[]>(initialFilters);

  const handleFilterReset = () => {
    setLocalFilters([]);
    onApply([]);
    onClose();
  };

  const handleFilterApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleCheckboxToggle = (value: string, checked: boolean) => {
    setLocalFilters((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((f) => f !== value);
      }
    });
  };

  return (
    <div className={s.filterMenu}>
      <Space direction="vertical" size={8} className={s.filterMenuContent}>
        {statusOptions
          .filter((option) => option.value)
          .map((option) => (
            <Checkbox
              key={option.value}
              checked={localFilters.includes(option.value)}
              onChange={(e) =>
                handleCheckboxToggle(option.value, e.target.checked)
              }
            >
              {option.label}
            </Checkbox>
          ))}
      </Space>
      <div className={s.filterMenuFooter}>
        <Button onClick={handleFilterReset}>Reset</Button>
        <Button type="primary" onClick={handleFilterApply}>
          OK
        </Button>
      </div>
    </div>
  );
};

export default FilterMenu;
