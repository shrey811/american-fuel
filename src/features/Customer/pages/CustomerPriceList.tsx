import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { Autocomplete, Box, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import Button from 'components/Button/Button';
import { shallowEqual } from 'react-redux';
import { customerEmail, customerPriceList } from 'store/slices/customerPriceListSlice';
import GeneralCard from 'components/UI/GeneralCard';
import { toast } from 'react-toastify';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { listProduct } from 'store/slices/productSlice';
import moment from 'moment';

interface Props {
    fetchCustomer: any;
}

const priceListInitialValues = {
    DateFrom: '',
    DateTo: '',
    ProductId: 0,
    CustomerId: 0,
}

const CustomerPriceList = (props: Props) => {
    const dispatch = useAppDispatch();
    const [initialData, setInitialData] = useState<typeof priceListInitialValues>({
        ...priceListInitialValues,
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [filterColumn, setFilterColumn] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('');

    useEffect(() => {
        // dispatch(customerPriceList(props.fetchCustomer.Id));
        dispatch(listProduct());
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(customerPriceList({
                    ...initialData,
                    DateFrom: null,
                    DateTo: null,
                    CustomerId: props.fetchCustomer.Id,
                }));
            } catch (error) {
                console.error("Error fetching customer price list:", error);
            }
        };

        fetchData();
    }, [dispatch, initialData, props.fetchCustomer.Id]);

    const [customerPriceListList, listCustomerPriceListLoading] = useAppSelector(
        (state) => [
            state.customerPriceListReducers.customerPriceListList,
            state.customerPriceListReducers.listCustomerPriceListLoading,
        ],
        shallowEqual
    );


    console.log("customerPriceListList", customerPriceListList);

    const [productList, listProductLoading] = useAppSelector(
        (state) => [
            state.productReducers.productList,
            state.productReducers.listProductLoading
        ],
        shallowEqual
    );

    const sortData = (array: any[], comparator: (a: any, b: any) => number) => {
        const stabilizedThis = array.map((el, index) => [el, index] as [any, number]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };


    const filteredcustomerPriceListData = customerPriceListList.filter(item =>
        Object.entries(item).some(([key, value]) =>
            (filterColumn ? key === filterColumn : true) &&
            (typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );
    const getComparator = (order: 'asc' | 'desc', orderBy: string) => {
        return order === 'desc'
            ? (a: any, b: any) => (b[orderBy] < a[orderBy] ? -1 : 1)
            : (a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : 1);
    };
    const sortedData = sortData(filteredcustomerPriceListData, getComparator(order, orderBy));

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setInitialData({ ...initialData, [name]: value });
    }
    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleProductChange = (newValue: any) => {
        setInitialData({ ...initialData, ProductId: newValue ? newValue.Id : 0 });
    };

    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => async () => {
    //     await dispatch(customerPriceList({w      
    //         ...initialData,
    //         DateFrom: null,
    //         DateTo: null,
    //         CustomerId: props.fetchCustomer.Id,
    //     }));
    // }, []);
    // const list = async () => {
    //     try {
    //         await dispatch(customerPriceList({
    //             ...initialData,
    //             DateFrom: null,
    //             DateTo: null,
    //             CustomerId: props.fetchCustomer.Id,
    //         }));
    //     } catch (error) {
    //         console.error("Error dispatching customerPriceList:", error);
    //     }
    // };

    const handleSubmit = async () => {
        try {
            const action = await dispatch(customerPriceList({
                ...initialData,
                DateFrom: moment.utc(initialData.DateFrom).format(),
                DateTo: moment.utc(initialData.DateTo).format(),
                CustomerId: props.fetchCustomer.Id,
            }));
            const response = action.payload;

            if (response.message.code === "SUCCESS") {
                toast.success(response.message.message);
            }
            if (response.message.code === "FAILED") {
                toast.error(response.message.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
        // props.toggleForm();
    }


    const handleSendEmail = async () => {
        setIsLoading(true);
        // const customer_id = props.fetchCustomer.Id;
        const initialState = {
            CustomerId: props.fetchCustomer.Id,
            DateFrom: initialData?.DateFrom ? moment.utc(initialData.DateFrom).format() : null,
            DateTo: initialData?.DateTo ? moment.utc(initialData.DateTo).format() : null,
            ProductId: initialData.ProductId,
        };
        const action = await dispatch(customerEmail(initialState));
        const response = action.payload;
        if (response.message.code === "SUCCESS") {
            toast.success("Email sent successfully");
        }
        else {
            toast.error("Email sending failed");
        }
        setIsLoading(false);
    };


    return (
        <GeneralCard title={"Customer Price List"}>
            <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
                <Grid container spacing={1} mt={1}>
                    <Grid item xs={12} sm={3}>
                        <TextValidator
                            fullWidth
                            label="Date Time From"
                            name="DateFrom"
                            value={initialData.DateFrom}
                            type="datetime-local"
                            size="small"
                            validators={['required']}
                            errorMessages={['This field is required']}
                            onChange={handleChange}
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextValidator
                            fullWidth
                            label="Data Time To"
                            name="DateTo"
                            value={initialData.DateTo}
                            type="datetime-local"
                            size="small"
                            validators={['required']}
                            errorMessages={['This field is required']}
                            onChange={handleChange}
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <Autocomplete
                            options={productList}
                            getOptionLabel={(option) => option.Name || ""}
                            value={productList.find((product) => product.Id === initialData.ProductId) || null}
                            onChange={(event, newValue) => handleProductChange(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Product" variant="filled" size="small" />
                            )}
                        />


                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <Button
                            type="submit"
                            name="Generate Price List"
                            variant='contained'
                            loading={listCustomerPriceListLoading}
                            disabled={listCustomerPriceListLoading}
                        />
                    </Grid>
                </Grid>

            </ValidatorForm >
            <Box style={{ marginTop: '30px' }}>
                <Grid container spacing={2} >


                    <Grid item xs={12} md={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow sx={{ background: '#EFEFEF' }}>
                                        <TableCell>EffectiveDateTime</TableCell>
                                        <TableCell>Product Category</TableCell>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Rate Type</TableCell>
                                        <TableCell>Opis Rate</TableCell>
                                        <TableCell>Markup</TableCell>
                                        <TableCell>Rate</TableCell>
                                        <TableCell>Unit</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">
                                                No data available
                                            </TableCell>
                                        </TableRow>
                                    ) : (

                                        sortedData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((item, index) => (
                                                <TableRow key={index} sx={{ background: index % 2 === 0 ? '#F8F8F8' : '#FFFFFF' }}>
                                                    <TableCell>{item.EffectiveDateTime}</TableCell>
                                                    <TableCell>{item.ProductCategory}</TableCell>
                                                    <TableCell>{item.Product}</TableCell>
                                                    <TableCell>{item.SubType}</TableCell>
                                                    <TableCell>{item.OpisRate}</TableCell>
                                                    <TableCell>{item.Markup}</TableCell>
                                                    <TableCell>{item.Rate}</TableCell>
                                                    <TableCell>{item.Unit}</TableCell>
                                                </TableRow>
                                            ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[25, 35, 45]}
                            component="div"
                            count={sortedData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>

                </Grid>
                <Grid item xs={12} display="flex">
                    <Button variant="contained" onClick={handleSendEmail}
                        disabled={isLoading} // Disable the button while loading
                        startIcon={isLoading ? <CircularProgress size={20} /> : null} >
                        Send Email
                    </Button>
                </Grid>

            </Box>
        </GeneralCard>
    );
};

export default CustomerPriceList;
