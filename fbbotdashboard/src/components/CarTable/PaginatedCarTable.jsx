import {useMemo, useRef, useState} from "react";
import {CarTable} from "./CarTable";
import {orderedAcumValues} from "../../utils/utils.py";


export default function PaginatedCarTable({
                                              type,
                                              setQueryParams,
                                              carsPage,
                                              isLoading,
                                              addSubscriberToUpdate,
                                              setUpdateArchiveTrigger,
                                              acumGroupValues,
                                              acumGroupIndex,
                                          }) {

    const [paginationSortFilterModel, setPaginationSortFilterModel] = useState({
        page: 0, pageSize: 10,
    });

    const rowCountRef = useRef(carsPage?.count || 0);

    const rowCount = useMemo(() => {
        if (carsPage?.count !== undefined) {
            rowCountRef.current = carsPage.count;
        }
        return rowCountRef.current;
    }, [carsPage?.count]);


    const requestUpdate = () => {
        if (type === "New") {
            console.log('new sub', orderedAcumValues(acumGroupValues, acumGroupIndex).join('XX'));
            addSubscriberToUpdate(orderedAcumValues(acumGroupValues, acumGroupIndex).join('XX'), false);
        } else {
            setUpdateArchiveTrigger(true);
        }
    }

    const handleSortModelChange = (data) => {
        setPaginationSortFilterModel(p => ({...p, sort: data[0]?.sort, sortField: data[0]?.field}));
        generateQueryParams({
            ...paginationSortFilterModel, sort: data[0]?.sort, sortField: data[0]?.field
        }, setQueryParams);
        requestUpdate();

    }

    const handleFilterModelChange = (data) => {
        setPaginationSortFilterModel(p => ({
            ...p,
            filterField: data.items[0]?.field,
            filterValue: data.items[0]?.value,
            filterOperator: data.items[0]?.operator
        }));
        generateQueryParams({
            ...paginationSortFilterModel,
            filterField: data.items[0]?.field,
            filterValue: data.items[0]?.value,
            filterOperator: data.items[0]?.operator
        }, setQueryParams);
        requestUpdate();

    }

    const handlePaginationModelChange = (data) => {
        setPaginationSortFilterModel(p => ({...p, page: data.page, pageSize: data.pageSize}));
        generateQueryParams({
            ...paginationSortFilterModel, page: data.page, pageSize: data.pageSize
        }, setQueryParams);
        requestUpdate();
    }


    return (<CarTable type={type}
                      carsPage={carsPage}
                      setUpdateArchiveTrigger={setUpdateArchiveTrigger}
                      addSubscriberToUpdate={addSubscriberToUpdate}
                      paginationSortFilterModel={paginationSortFilterModel}
                      rowCount={rowCount}
                      isLoading={isLoading}
                      handleSortModelChange={handleSortModelChange}
                      handlePaginationModelChange={handlePaginationModelChange}
                      handleFilterModelChange={handleFilterModelChange}
                      acumGroupIndex={acumGroupIndex}
                      acumGroupValues={acumGroupValues}
    />);

}

function generateQueryParams(paginationSortFilterModel, setQueryParams) {

    let queryObj = {
        'page': paginationSortFilterModel.page + 1, 'page_size': paginationSortFilterModel.pageSize
    };

    if (paginationSortFilterModel?.filterField && paginationSortFilterModel?.filterValue && paginationSortFilterModel?.filterOperator) {
        queryObj['filter_field'] = paginationSortFilterModel.filterField;
        queryObj['filter_operator'] = paginationSortFilterModel.filterOperator;
        queryObj['filter_value'] = paginationSortFilterModel.filterValue;
    }

    if (paginationSortFilterModel?.sortField && paginationSortFilterModel?.sort) {
        queryObj['sorting_field'] = paginationSortFilterModel.sortField;
        queryObj['order_type'] = paginationSortFilterModel.sort;
    }
    setQueryParams(new URLSearchParams(queryObj).toString());

}
