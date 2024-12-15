import React, { useCallback, useEffect, useState } from "react";
import {
  Select,
  Space,
  Button,
  Tag,
  Input,
  List,
  Checkbox,
  Popover,
} from "antd";
import cn from "clsx";
import {
  EllipsisOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import s from "./ProductListing.module.css";
import { Product, mockProducts } from "./mockedProducts";
import FilterMenu from "./FilterMenu";

const statusStyles = {
  ACTIVE: { color: "#52c41a", text: "Active" },
  INACTIVE: { color: "#faad14", text: "Inactive" },
  SUSPENDED: { color: "#ff4d4f", text: "Suspended" },
  TERMINATED: { color: "#d9d9d9", text: "Terminated" },
};

interface ProductState {
  data: Product[];
  loading: boolean;
  error: Error | null;
  searchValue: string;
  filterValue: string | null;
  menuFilters: string[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

const useProductData = (initialPageSize: number) => {
  const [state, setState] = useState<ProductState>({
    data: [],
    loading: false,
    error: null,
    searchValue: "",
    filterValue: null,
    menuFilters: [], // Add this
    pagination: {
      current: 1,
      pageSize: initialPageSize,
      total: mockProducts.length,
    },
  });

  const fetchData = useCallback(
    async (
      page: number,
      filter: string | null,
      search: string,
      newPageSize?: number
    ) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let filteredData = [...mockProducts];

        if (filter) {
          const filters = filter.includes(",") ? filter.split(",") : [filter];
          filteredData = filteredData.filter((item) =>
            filters.includes(item.status)
          );
        }

        if (search) {
          filteredData = filteredData.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Use the new pageSize if provided, otherwise use the current one
        const pageSize = newPageSize ?? state.pagination.pageSize;
        const startIndex = (page - 1) * pageSize;
        const paginatedData = filteredData.slice(
          startIndex,
          startIndex + pageSize
        );

        setState((prev) => ({
          ...prev,
          data: paginatedData,
          loading: false,
          filterValue: filter,
          searchValue: search,
          pagination: {
            ...prev.pagination,
            current: page,
            pageSize: newPageSize ?? prev.pagination.pageSize,
            total: filteredData.length,
          },
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err : new Error("An error occurred"),
        }));
      }
    },
    [state.pagination.pageSize]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (!state.loading) {
        fetchData(page, state.filterValue, state.searchValue);
      }
    },
    [state.loading, state.filterValue, state.searchValue, fetchData]
  );

  // Update handlePageSizeChange in useProductData hook
  const handlePageSizeChange = useCallback(
    (_current: number, pageSize: number) => {
      if (state.loading) return;
      setState((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          pageSize,
          current: 1,
        },
      }));
      // Pass the new pageSize to fetchData
      fetchData(1, state.filterValue, state.searchValue, pageSize);
    },
    [state.loading, state.filterValue, state.searchValue, fetchData]
  );

  const handleFilterChange = useCallback(
    (value: string | null, filters: string[]) => {
      // Add filters parameter
      if (state.loading) return;
      setState((prev) => ({
        ...prev,
        filterValue: value,
        menuFilters: filters, // Update both together
      }));
      fetchData(1, value, state.searchValue);
    },
    [state.loading, state.searchValue, fetchData]
  );

  const handleSearch = useCallback(
    (value: string) => {
      if (state.loading) return;
      setState((prev) => ({ ...prev, searchValue: value }));
      fetchData(1, state.filterValue, value);
    },
    [state.loading, state.filterValue, fetchData]
  );

  const resetAll = useCallback(() => {
    if (state.loading) return;
    setState((prev) => ({
      ...prev,
      filterValue: null,
      searchValue: "",
      menuFilters: [], // Add this to clear the menu filters
    }));
    fetchData(1, null, "");
  }, [state.loading, fetchData]);

  useEffect(() => {
    fetchData(1, null, "");
  }, [fetchData]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    filterValue: state.filterValue,
    searchValue: state.searchValue,
    pagination: state.pagination,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
    handleSearch,
    resetAll,
    menuFilters: state.menuFilters,
  };
};

const ProductListing: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const {
    data,
    loading,
    error,
    filterValue,
    searchValue,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
    handleSearch,
    resetAll,
    menuFilters,
  } = useProductData(10);

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
    { label: "Suspended", value: "SUSPENDED" },
    { label: "Terminated", value: "TERMINATED" },
  ];

  const handleFilterMenuOpen = (open: boolean) => {
    setFilterMenuOpen(open);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  const handleSelectChange = (value: string) => {
    const newValue = value === "" ? null : value;
    const newFilters = newValue ? [newValue] : [];
    handleFilterChange(newValue, newFilters);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFilterApply = (filters: string[]) => {
    handleFilterChange(filters.length ? filters.join(",") : null, filters);
    setFilterMenuOpen(false);
  };

  const handleResetAll = () => {
    setSelectedItems([]);
    resetAll();
  };

  const renderBadges = (badges?: Array<"M" | "K">) => {
    if (!badges) return null;
    return (
      <Space size={2}>
        {badges.map((badge, index) => (
          <div key={index} className={cn(s.badge, s[`badge${badge}`])}>
            {badge}
          </div>
        ))}
      </Space>
    );
  };

  const renderStatus = (status: string) => {
    const style = statusStyles[status as keyof typeof statusStyles];
    if (!style) return null;

    return (
      <div className={s.statusIndicator} style={{ color: style.color }}>
        {style.text}
      </div>
    );
  };

  return (
    <div className={s.productListing}>
      <div className={s.productHeader}>
        <h1>Instrument Products ({pagination.total})</h1>
        <div className={s.headerActions}>
          <Input
            placeholder="Search"
            onChange={handleInputChange}
            className={s.searchInput}
            suffix={<SearchOutlined />}
            value={searchValue}
          />
          <Button type="primary" className={s.addNewBtn}>
            Add New
          </Button>
          <div className={s.iconGroup}>
            <MenuOutlined className={s.headerIcon} />
            <EllipsisOutlined className={s.headerIcon} />
          </div>
        </div>
      </div>

      <div className={s.filterSection}>
        <div className={s.filterControls}>
          <Select
            placeholder="Status: All"
            onChange={handleSelectChange}
            value={filterValue === null ? "" : filterValue}
            style={{ width: 120 }}
            options={statusOptions}
            allowClear
          />
          <Popover
            content={
              <FilterMenu
                key={menuFilters.join(",")} // Add this key
                initialFilters={menuFilters}
                statusOptions={statusOptions}
                onApply={handleFilterApply}
                onClose={() => setFilterMenuOpen(false)}
              />
            }
            trigger="click"
            open={filterMenuOpen}
            onOpenChange={handleFilterMenuOpen}
            placement="bottom"
          >
            <Button>+ Add Filter</Button>
          </Popover>
        </div>
        <Button type="text" onClick={handleResetAll}>
          Reset All
        </Button>
      </div>

      {error && <div className={s.errorMessage}>{error.message}</div>}

      <List
        loading={loading}
        dataSource={data}
        className={s.productList}
        renderItem={(item) => (
          <List.Item
            className={cn(s.productItem, {
              [s.selected]: selectedItems.includes(item.id),
            })}
          >
            <Checkbox
              checked={selectedItems.includes(item.id)}
              onChange={() => handleCheckboxChange(item.id)}
            />
            <div className={s.cardImage}>
              <div
                className={cn(s.cardPlaceholder, {
                  [s.mastercard]: item.network?.toLowerCase() === "mastercard",
                  [s.visa]: item.network?.toLowerCase() === "visa",
                })}
              />
            </div>
            <div className={s.productInfo}>
              <Space size={4}>
                <span className={s.productName}>{item.name}</span>
                <span className={s.productVersion}>v{item.version}</span>
                {renderBadges(item.badges)}
              </Space>
              <div className={s.productNetwork}>{item.network}</div>
              <Space size={4} className={s.productTags}>
                <Tag>{item.type}</Tag>
                <Tag>{item.subtype}</Tag>
              </Space>
            </div>
            <div className={s.productStatus}>{renderStatus(item.status)}</div>
            <Button type="link">view</Button>
          </List.Item>
        )}
        pagination={{
          ...pagination,
          className: s.antPaginationCustom,
          align: "center",
          defaultPageSize: pagination.pageSize,
          pageSize: pagination.pageSize,
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange,
          showSizeChanger: true,
          showQuickJumper: false,
          showTotal: (total) => (
            <div className={s.antPaginationTotalText}>Total {total} items</div>
          ),
          itemRender: (_page, type, originalElement) => {
            if (type === "prev") {
              return (
                <Button type="text" size="small">
                  {"<"}
                </Button>
              );
            }
            if (type === "next") {
              return (
                <Button type="text" size="small">
                  {">"}
                </Button>
              );
            }
            return originalElement;
          },
        }}
      />
    </div>
  );
};

export default ProductListing;
