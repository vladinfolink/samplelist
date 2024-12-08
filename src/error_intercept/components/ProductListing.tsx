import React, { useCallback, useEffect, useState } from "react";
import { Select, Space, Button, Tag, Input, List, Checkbox } from "antd";
import {
  EllipsisOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "./ProductListing.css";
import { Product, mockProducts } from "./mockedProducts";

const statusStyles = {
  ACTIVE: { color: "#52c41a", text: "Approved" },
  INACTIVE: { color: "#faad14", text: "Warning" },
  SUSPENDED: { color: "#ff4d4f", text: "Error" },
  TERMINATED: { color: "#d9d9d9", text: "Terminated" },
};

interface ProductState {
  data: Product[];
  loading: boolean;
  error: Error | null;
  searchValue: string;
  filterValue: string | null;
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
          filteredData = filteredData.filter((item) => item.status === filter);
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
    (current: number, pageSize: number) => {
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
    (value: string | null) => {
      if (state.loading) return;
      setState((prev) => ({ ...prev, filterValue: value }));
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
  };
};

const ProductListing: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
  } = useProductData(10);

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
    { label: "Suspended", value: "SUSPENDED" },
    { label: "Terminated", value: "TERMINATED" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  const handleSelectChange = (value: string) => {
    handleFilterChange(value === "" ? null : value);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
          <div key={index} className={`badge badge-${badge.toLowerCase()}`}>
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
      <div className="status-indicator" style={{ color: style.color }}>
        {style.text}
      </div>
    );
  };

  return (
    <div className="product-listing">
      <div className="product-header">
        <h1>Instrument Products ({pagination.total})</h1>
        <div className="header-actions">
          <Input
            placeholder="Search"
            onChange={handleInputChange}
            className="search-input"
            suffix={<SearchOutlined />}
            value={searchValue}
          />
          <Button type="primary">Add New</Button>
          <div className="icon-group">
            <MenuOutlined className="header-icon" />
            <EllipsisOutlined className="header-icon" />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-controls">
          <Select
            placeholder="Status: All"
            onChange={handleSelectChange}
            value={filterValue === null ? "" : filterValue}
            style={{ width: 120 }}
            options={statusOptions}
            allowClear
          />
          <Button>+ Add Filter</Button>
        </div>
        <Button type="text" onClick={handleResetAll}>
          Reset All
        </Button>
      </div>

      {error && <div className="error-message">{error.message}</div>}

      <List
        loading={loading}
        dataSource={data}
        className="product-list"
        renderItem={(item) => (
          <List.Item
            className={`product-item ${
              selectedItems.includes(item.id) ? "selected" : ""
            }`}
          >
            <Checkbox
              checked={selectedItems.includes(item.id)}
              onChange={() => handleCheckboxChange(item.id)}
            />
            <div className="card-image">
              <div
                className={`card-placeholder ${
                  item.network?.toLowerCase() || ""
                }`}
              />
            </div>
            <div className="product-info">
              <Space size={4}>
                <span className="product-name">{item.name}</span>
                <span className="product-version">v{item.version}</span>
                {renderBadges(item.badges)}
              </Space>
              <div className="product-network">{item.network}</div>
              <Space size={4} className="product-tags">
                <Tag>{item.type}</Tag>
                <Tag>{item.subtype}</Tag>
              </Space>
            </div>
            <div className="product-status">{renderStatus(item.status)}</div>
            <Button type="link">view</Button>
          </List.Item>
        )}
        pagination={{
          ...pagination,
          className: "ant-pagination-custom",
          defaultPageSize: pagination.pageSize,
          pageSize: pagination.pageSize,
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange,
          showSizeChanger: true,
          showQuickJumper: false,
          showTotal: (total) => (
            <div className="pagination-total">Total {total} items</div>
          ),
          align: "center",
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
