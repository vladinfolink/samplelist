import { useCallback, useEffect, useState } from 'react';
import { Button, Select, Space, Table } from 'antd';

interface InstrumentData {
  id: string;
  status: string;
  name: string;
  type: string;
}

interface State {
  data: InstrumentData[];
  loading: boolean;
  error: Error | null;
  filterValue: string | null;
  pagination: {
    prevToken: string | null;
    nextToken: string | null;
    pageSize: number;
  };
}

interface FetchDataProps {
  token?: string | null;
  pageSize: number;
  filter?: string | null;
}

type TableColumn = {
  title: string;
  dataIndex: keyof InstrumentData;
  key: string;
};

type StatusOption = {
  label: string;
  value: string;
};

// Mock data
const mockData: InstrumentData[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Instrument ${i + 1}`,
  type: `Type ${String.fromCharCode(65 + (i % 3))}`,
  status: ['active', 'pending', 'suspended'][i % 3]
}));

const mockStatuses: StatusOption[] = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Suspended', value: 'suspended' }
];

const instrumentTableColumns: TableColumn[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  }
];

const fetchdata = async ({ token, pageSize, filter }: FetchDataProps) => {
  let filteredData = [...mockData];

  if (filter) {
    filteredData = filteredData.filter(item => item.status === filter);
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  const startIndex = token ? parseInt(token, 10) : 0;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
  const nextToken = startIndex + pageSize < filteredData.length ? `${startIndex + pageSize}` : null;

  return {
    items: paginatedData,
    nextToken
  };
};


const useInstrumentData = (pageSize: number) => {
  const [state, setState] = useState<State>({
    data: [],
    loading: false,
    error: null,
    filterValue: null,
    pagination: {
      prevToken: null,
      nextToken: null,
      pageSize
    }
  });

  const fetchData = useCallback(async (
    currentToken: string | null,
    filter: string | null
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetchdata({
        token: currentToken,
        pageSize: state.pagination.pageSize,
        filter
      });

      setState(prev => ({
        ...prev,
        data: response.items,
        loading: false,
        filterValue: filter,
        pagination: {
          ...prev.pagination,
          prevToken: currentToken === '0' || currentToken === null ? null : currentToken,
          nextToken: response.nextToken
        }
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err : new Error('An error occurred')
      }));
    }
  }, [state.pagination.pageSize]);

  const handleNext = useCallback(() => {
    if (!state.loading && state.pagination.nextToken) {
      fetchData(state.pagination.nextToken, state.filterValue);
    }
  }, [state.loading, state.pagination.nextToken, state.filterValue, fetchData]);

  const handlePrev = useCallback(() => {
    if (!state.loading && state.pagination.prevToken) {
      const currentIndex = parseInt(state.pagination.prevToken, 10);
      const prevToken = currentIndex > 0 ? `${Math.max(0, currentIndex - state.pagination.pageSize)}` : null;
      fetchData(prevToken, state.filterValue);
    }
  }, [state.loading, state.pagination.prevToken, state.pagination.pageSize, state.filterValue, fetchData]);

  const handleFilterChange = useCallback((value: string | null) => {
    if (state.loading) return;
    fetchData(null, value);
  }, [state.loading, fetchData]);

  useEffect(() => {
    fetchData(null, null);
  }, [fetchData]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    filterValue: state.filterValue,
    pagination: state.pagination,
    handleNext,
    handlePrev,
    handleFilterChange
  };
};

export const Instruments = () => {
  const {
    data,
    loading,
    error,
    filterValue,
    pagination,
    handleNext,
    handlePrev,
    handleFilterChange
  } = useInstrumentData(10);

  return (
    <div>
      <Space direction="vertical" size={16}>
        {error && (
          <div className="text-red-500">
            {error.message}
          </div>
        )}

        <div>
          <Select
            placeholder="Select a status"
            onChange={handleFilterChange}
            value={filterValue}
            allowClear
            options={mockStatuses}
            style={{ width: 200 }}
            disabled={loading}
          />
        </div>

        <Table<InstrumentData>
          columns={instrumentTableColumns}
          dataSource={data}
          loading={loading}
          pagination={false}
          rowKey="id"
        />

        <Space>
          <Button
            onClick={handlePrev}
            disabled={loading || !pagination.prevToken}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={loading || !pagination.nextToken}
          >
            Next
          </Button>
        </Space>
      </Space>
    </div>
  );
};
