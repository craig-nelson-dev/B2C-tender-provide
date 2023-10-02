import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import {
  Box,
  Input,
  Button,
  Select,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
  HStack,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { _t } from "../../Utils/_t";

const paginationOptions = [5, 10, 20, 50];

const ChollitosTable = ({
  data,
  columns,
  index = 0,
  setIndex,
  size = 5,
  setSize,
  filter = '',
  setFilter,
  sort = [{ desc: true }],
  setSort,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page,
    state,
    gotoPage,
    setGlobalFilter,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
  } = useTable(
    {
      columns: columns,
      data: data,
      initialState: {
        pageIndex: index,
        pageSize: size,
        sortBy: sort,
        globalFilter: filter,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );
  const { globalFilter, pageIndex, pageSize } = state;
  const pageCount = pageOptions.length;
  const { t } = useTranslation();

  return (
    <Box>
      <Flex>
        <Box padding={2}>
          <span>
            <strong>
              {data.length}
            </strong>
            {' ' + t(_t('Records'))}
          </span>
        </Box>
        <Spacer />
        <Input
          ml='20px'
          maxWidth={'300px'}
          value={globalFilter || ''}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            setFilter(e.target.value);
          }}
          placeholder={t(_t('Search')) + '...'}
          mb={4}
        />
      </Flex>
      <Box overflow='auto' maxH={'calc(100vh - 330px)'}>
        <Table {
          ...getTableProps()}
          size={'sm'}
          variant="striped"
        >
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    color={'white'}
                    bg={'blue.500'}
                    position={'sticky'}
                    top={0}
                    zIndex={1}
                    onClick={() => {
                      column.toggleSortBy();
                      setTimeout(() => {
                        setSort([{
                          id: column.isSorted ? column.id : '',
                          desc: column.isSortedDesc,
                        }]);
                      }, 0);
                    }}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? <ChevronDownIcon /> : <ChevronUpIcon />) : ''}
                    </span>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {!columns.find(column => column.accessor === 'id') && <Td>{index + 1}</Td>}
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <HStack spacing={2} mt={'12px'}>
        <Button onClick={() => {
          gotoPage(0);
          setIndex(0);
        }}
          disabled={!canPreviousPage} size={'sm'}
        >
          {t(_t('First'))}
        </Button>
        <Button onClick={() => {
          previousPage();
          setIndex(index > 0 ? index - 1 : 0);
        }}
          disabled={!canPreviousPage}
          size={'sm'}
        >
          <ChevronLeftIcon />
        </Button>
        <Input
          size={'sm'}
          maxWidth={'80px'}
          style={{ textAlign: 'center' }}
          value={pageIndex}
          onChange={(e) => {
            gotoPage(e.target.value);
            setIndex(e.target.value);
          }}
        />
        <Button onClick={() => {
          gotoPage(pageIndex * 1 + 1);
          setIndex(index * 1 + 1);
        }}
          disabled={!canNextPage}
          size={'sm'}
        >
          <ChevronRightIcon />
        </Button>
        <Button onClick={() => {
          gotoPage(pageCount - 1);
          setIndex(pageCount - 1);
        }}
          disabled={!canNextPage}
          size={'sm'}
        >
          {t(_t('Last'))}
        </Button>
        <span>
          {t(_t('Page')) + ' '}
          <strong>
            {pageIndex} / {Math.ceil(data.length / pageSize) - 1}
          </strong>
        </span>
        <Spacer />
        <span>{t(_t('Show'))}</span>
        <Select
          size={'sm'}
          width={'64px'}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setSize(size);
            setIndex(0);
          }}
        >
          {paginationOptions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </HStack>
    </Box>
  );
};

export default ChollitosTable;