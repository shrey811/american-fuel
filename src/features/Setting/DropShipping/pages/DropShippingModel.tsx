import { Box, Typography, Divider, Grid, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import GeneralModal from "components/UI/GeneralModal";
import PurchaseOrderForm from "features/PurchaseOrder/pages/PurchaseOrderForm";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { listCustomer } from "store/slices/customerSlice";
import { listDropShip } from "store/slices/dropShipSlice";
import { listProduct } from "store/slices/productSlice";
import { listAllTerminal } from "store/slices/terminalSlice";
import { listVendor } from "store/slices/vendorSlice";
import { DropShipDataType } from "types/DropShipType";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    toggle: () => void;
    dropShipData: DropShipDataType | null;
}

const DropShipDetailsModal = (props: Props) => {
    const { isOpen, onClose, toggle, dropShipData } = props;
    console.log("dropShipData", dropShipData);

    const dispatch = useAppDispatch();
    const [isPurchaseOrderFormOpen, setPurchaseOrderFormOpen] = useState(false);

    // useEffect(() => {
    //     dispatch(listDropShip());
    //     dispatch(listAllTerminal());
    //     dispatch(listCustomer());
    //     dispatch(listVendor());
    //     dispatch(listProduct());
    // }, [dispatch]);

    const [vendorList] = useAppSelector(
        (state) => [
            state.vendorReducers.vendorList
        ],
        shallowEqual
    );

    const [terminalList] = useAppSelector(
        (state) => [
            state.terminalReducers.terminalListData
        ],
        shallowEqual
    );

    const [productlList] = useAppSelector(
        (state) => [
            state.productReducers.productList
        ],
        shallowEqual
    );

    const [stateList] = useAppSelector(
        (state) => [
            state.stateReducers.stateListData
        ],
        shallowEqual
    );
    const [cityList] = useAppSelector(
        (state) => [
            state.cityReducers.cityList
        ],
        shallowEqual
    );
    const findVendorName = (vendorId: any) => {
        const vendor = vendorList.find(item => item.Id === vendorId);
        return vendor ? vendor.DisplayName : '';
    };

    const findProductDetails = (productId: any) => {
        const product = productlList.find(item => item.Id === productId);
        return product ? { name: product.Name, description: product.Description } : { name: '', description: '' };
    };


    // const findProductName = (productId: any) => {
    //     const product = productlList.find(item => item.Id === productId);
    //     return product ? product.Name : '';
    // };

    const findStateName = (stateId: any) => {
        const state = stateList.find(item => item.Id === stateId);
        return state ? state.Name : '';
    };

    const findCityName = (cityId: any) => {
        const city = cityList.find(item => item.Id === cityId);
        return city ? city.Name : '';
    };

    const findTerminalName = (terminalId: any) => {
        const terminal = terminalList.find(item => item.Id === terminalId);
        return terminal ? terminal.Name : '';
    };

    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const handleModalClose = () => {
        onClose();
    };

    const handlePurchaseOrderFormOpen = () => {


        setPurchaseOrderFormOpen(true);
    };

    const handlePurchaseOrderFormClose = () => {
        handleModalClose();
        setPurchaseOrderFormOpen(false);
    };

    return (
        <>
            <GeneralModal
                open={isOpen}
                handleClose={handleModalClose}
                title="Drop Shipping Details"
                toggle={toggle}
                width='67%'
            >
                <Box sx={{ p: 2, pb: 2, pt: 0 }}>
                    {dropShipData && (
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sx={{ paddingLeft: '3rem!important' }}>
                                    <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: '100px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Supplier :</span>
                                        <span style={{ fontSize: '0.72rem' }}>{findVendorName(dropShipData.VendorsFId)}</span>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex' }}>
                                        <span style={{ width: '100px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Terminal :</span>
                                        <span style={{ fontSize: '0.72rem' }}>{findTerminalName(dropShipData.TerminalsFId)}</span>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex' }}>
                                        <span style={{ width: '100px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>BOL :</span>
                                        <span style={{ fontSize: '0.72rem' }}>{dropShipData.BOL}</span>
                                    </Typography>

                                </Grid>
                                <Grid item xs={6} sx={{ paddingLeft: '3rem!important' }}>
                                    <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: '150px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Delivery Date :</span>
                                        <span style={{ fontSize: '0.7rem' }}>{formatDateTime(dropShipData.DeliveryDateTime)}</span>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex' }}>
                                        <span style={{ width: '150px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Order Date :</span>
                                        <span style={{ fontSize: '0.7rem' }}>{formatDateTime(dropShipData.OrderDateTime)}</span>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex' }}>
                                        <span style={{ width: '150px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Load Date :</span>
                                        <span style={{ fontSize: '0.7rem' }}>{formatDateTime(dropShipData.LoadDateTime)}</span>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>

                                <Grid item xs={12} md={12} mt={1} className="table-responsivesssssssssssss" sx={{ paddingLeft: '0.45rem!important' }}>
                                    {dropShipData.SODetails && dropShipData.SODetails.length > 0 && (
                                        <Typography variant="h5" sx={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 'bold', color: '#000000' }}>Sales Order Details</Typography>
                                    )}
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                            <TableHead>
                                                <TableRow sx={{ background: '#EFEFEF' }}>
                                                    <TableCell>Id</TableCell>
                                                    <TableCell>Document Number</TableCell>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell>Product Description</TableCell>
                                                    {/* <TableCell>Basis</TableCell>
                                                    <TableCell>Unit Rate</TableCell>
                                                    <TableCell>Amount</TableCell>
                                                    <TableCell>Billed Quantity</TableCell> */}
                                                    <TableCell>Net Quantity</TableCell>
                                                    <TableCell>Gross Quantity</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {/* {Array.isArray(props.customerAssets) && props.customerAssets.length > 0 ? ( */}
                                                {dropShipData.SODetails.length > 0 ? (
                                                    dropShipData.SODetails.map((item: any, index: any) => {
                                                        const { name, description } = findProductDetails(item.ProductsFId);
                                                        return (
                                                            <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell>{item.SODocNumber}</TableCell>
                                                                <TableCell>{name}</TableCell>
                                                                <TableCell>{description}</TableCell>
                                                                <TableCell>{item.NetQuantity}</TableCell>
                                                                <TableCell>{item.GrossQuantity}</TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={9} align="center">
                                                            No data available
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePurchaseOrderFormOpen}
                        sx={{ mt: 2, float: 'inline-end' }}
                    >
                        Create Purchase Order Form
                    </Button>
                </Box>
            </GeneralModal>

            {isPurchaseOrderFormOpen && (
                <GeneralModal
                    open={isPurchaseOrderFormOpen}
                    handleClose={handlePurchaseOrderFormClose}
                    title="Purchase Order Form"
                    width='70%'
                >
                    <PurchaseOrderForm
                        productList={null} // Ensure correct variable name
                        toggleForm={handlePurchaseOrderFormClose}
                        dropShipData={dropShipData || undefined} // Handle null to match type
                    />

                </GeneralModal>
            )}

        </>
    );
};

export default DropShipDetailsModal;
