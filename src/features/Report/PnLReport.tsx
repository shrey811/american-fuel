import { Autocomplete, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Button from 'components/Button/Button';
import GeneralCard from 'components/UI/GeneralCard';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listProduct } from 'store/slices/productSlice';
import { addReport } from 'store/slices/reportSlice';
import * as XLSX from 'xlsx';

const pnLReportInitialValues = {
    DateTimeFrom: '',
    DateTimeTo: '',
    ProductsId: [] as number[],
}
type ReportResponseModel = {
    Sn: string;
    Bol: string;
    POProduct_Id: string | null;
    POProduct_Name: string | null;
    POBilledQuantity: string | null;
    POUnitRate: string | null;
    POAmount: string | null;
    SOProduct_Id: string | null;
    SOProduct_Name: string | null;
    SOBilledQuantity: string | null;
    SOUnitRate: string | null;
    SOAmount: string | null;
    DifferenceQuantity: string | null;
    DifferenceAmount: string | null;
}


const PnLReport = () => {


    const dispatch = useAppDispatch();
    const [initialData, setInitialData] = useState<typeof pnLReportInitialValues>({
        ...pnLReportInitialValues,

    });
    const [tableData, setTableData] = useState<ReportResponseModel[]>([]);
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setInitialData({ ...initialData, [name]: value });
    }
    useEffect(() => {
        dispatch(listProduct());
    }, []);
    useEffect(() => {
        const now = new Date().toISOString().slice(0, 16);
        setInitialData(prevState => ({
            ...prevState,
            DateTimeFrom: now,
            DateTimeTo: now,

        }));
    }, []);

    const [productList, listProductLoading] = useAppSelector(
        (state) => [
            state.productReducers.productList,
            state.productReducers.listProductLoading
        ],
        shallowEqual
    );
    const handleProductAutocompleteChange = (newValue: any[]) => {
        const selectedProductIds = newValue.map((product) => product.Id);
        setInitialData((prevState) => ({
            ...prevState,
            ProductsId: selectedProductIds,
        }));
    };



    const exportToExcel = () => {
        const wsData = [
            [], [], [], [], [], [], [],
            ["", "", "Purchase", "", "", "", "Sales", "", "", "", "Difference", ""],
            ["Sn", "BOL", "Product", "billed Qty", "Rate", "Purchase Cost", "Product", "billed Qty", "Rate", "Amount", "Qty", "Amount"],
            ...tableData.map(item => [
                item.Sn,
                item.Bol,
                item.POProduct_Name,
                item.POBilledQuantity,
                item.POUnitRate,
                item.POAmount,
                item.SOProduct_Name,
                item.SOBilledQuantity,
                item.SOUnitRate,
                item.SOAmount,
                item.DifferenceQuantity,
                item.DifferenceAmount,
            ])
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws["!merges"] = [
            { s: { r: 7, c: 2 }, e: { r: 7, c: 5 } },
            { s: { r: 7, c: 6 }, e: { r: 7, c: 9 } },
            { s: { r: 7, c: 10 }, e: { r: 7, c: 11 } },
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "PnLReport");
        XLSX.writeFile(wb, "PnLReport.xlsx");
    };


    const handleSubmit = async () => {
        try {
            const action = await dispatch(addReport({
                ...initialData,
                DateTimeFrom: moment.utc(initialData.DateTimeFrom).format(),
                DateTimeTo: moment.utc(initialData.DateTimeTo).format(),
            }));
            const response = action.payload;
            console.log('mmss', response);
            setInitialData({ ...pnLReportInitialValues });
            if (response.message.data) {
                console.log('mmss', response.message.data);

                setTableData(response.message.data);
                if (response.message.code === "SUCCESS") {
                    toast.success(response.message.message);
                } else if (response === null) {
                    toast.error(response.message.message);
                }
            }

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



    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
                <GeneralCard title={"PnL BOL Report"}>
                    <Box>
                        <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
                            <Grid container spacing={1} mt={1}>
                                <Grid item xs={12} sm={3}>
                                    <TextValidator
                                        fullWidth
                                        label="Date Time From"
                                        name="DateTimeFrom"
                                        value={initialData.DateTimeFrom}
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
                                        name="DateTimeTo"
                                        value={initialData.DateTimeTo}
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
                                        multiple
                                        options={productList}
                                        getOptionLabel={(option) => option.Name}
                                        value={productList.filter((product) =>
                                            initialData.ProductsId.includes(product.Id)
                                        )}
                                        onChange={(event, newValue) => handleProductAutocompleteChange(newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Products"
                                                variant="filled"
                                                size="small"
                                            />
                                        )}
                                    />

                                </Grid>
                                <Grid item xs={3} sm={3}>
                                    <Button
                                        type="submit"
                                        name="Generate Report"
                                        variant='contained'
                                        loading={listProductLoading}
                                        disabled={listProductLoading}
                                    />
                                </Grid>
                            </Grid>

                        </ValidatorForm >

                        {/* Table Section */}
                        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" colSpan={6} sx={{ fontWeight: 'bold', borderBottom: "none" }}>Purchase</TableCell>
                                        <TableCell align="center" colSpan={5} sx={{ fontWeight: 'bold', borderBottom: "none" }}>Sales</TableCell>
                                        <TableCell align="center" colSpan={2} sx={{ fontWeight: 'bold', borderBottom: "none" }}>Difference</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Sn</TableCell>
                                        <TableCell>BOL</TableCell>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Billed Qty</TableCell>
                                        <TableCell>Rate</TableCell>
                                        <TableCell>Purchase Cost</TableCell>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Billed Qty</TableCell>
                                        <TableCell>Rate</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Qty</TableCell>
                                        <TableCell>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.Sn}</TableCell>
                                            <TableCell>{row.Bol}</TableCell>
                                            <TableCell>{row.POProduct_Name}</TableCell>
                                            <TableCell>{row.POBilledQuantity}</TableCell>
                                            <TableCell>{row.POUnitRate}</TableCell>
                                            <TableCell>{row.POAmount}</TableCell>
                                            <TableCell>{row.SOProduct_Name}</TableCell>
                                            <TableCell>{row.SOBilledQuantity}</TableCell>
                                            <TableCell>{row.SOUnitRate}</TableCell>
                                            <TableCell>{row.SOAmount}</TableCell>
                                            <TableCell>{row.DifferenceQuantity}</TableCell>
                                            <TableCell>{row.DifferenceAmount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Export Button */}
                        <Box sx={{ marginTop: '10px' }}>
                            <Button variant="contained" color="primary" onClick={exportToExcel} sx={{ marginTop: '10px' }}>
                                Export to Excel
                            </Button>
                        </Box>
                    </Box >
                </GeneralCard>
            </Grid>
        </Grid>
    )

}

export default PnLReport