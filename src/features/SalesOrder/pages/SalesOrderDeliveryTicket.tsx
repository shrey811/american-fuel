import React, { useEffect, useRef } from 'react';
import {
    Box,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    Button,
} from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { shallowEqual } from 'react-redux';
import { listDliveryTiceket } from 'store/slices/deliveryticektSlice';
import moment from 'moment';
import Logo from '../../../assets/americanpetroleum.png'
import { DeliveryBillStyles, deliverysStyles, deliveryTableCellStyles, headTableCellStyles, ordersStyles, ShipBillStyles } from './styles';

interface Props {
    salesOrderId: number | null;
}

const DeliveryTicketPage = ({ salesOrderId }: Props) => {
    const dispatch = useAppDispatch();
    const deliveryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (salesOrderId) {
            dispatch(listDliveryTiceket(salesOrderId));
        }
    }, [salesOrderId, dispatch]);

    const [delivertTicketList, listDelivertTicketLoading] = useAppSelector(
        (state) => [
            state.deliveryTicketReducers.delivertTicketList,
            state.deliveryTicketReducers.listDelivertTicketloading,
        ],
        shallowEqual
    );

    const [productList, listProductLoading] = useAppSelector(
        (state) => [
            state.productReducers.productList,
            state.productReducers.listProductLoading
        ],
        shallowEqual
    );
    const [stateListData, stateDataLoading] = useAppSelector(
        (state) => [
            state.stateReducers.stateListData,
            state.stateReducers.stateDataLoading
        ],
        shallowEqual
    );

    const [cityList, listCityLoading] = useAppSelector(
        (state) => [
            state.cityReducers.cityList,
            state.cityReducers.listCityLoading
        ],
        shallowEqual
    );

    const getCityNameById = (id: number) => {
        const city = cityList.find((city: any) => city.Id === id);
        return city ? city.Name : 'N/A';
    };

    const getStateNameById = (id: number) => {
        const state = stateListData.find((state: any) => state.Id === id);
        return state ? state.Name : 'N/A';
    };

    const handleDownloadPDF = async () => {
        const ticketElement = deliveryRef.current;
        if (ticketElement) {
            const canvas = await html2canvas(ticketElement, { scale: 2 });
            const imgData = canvas.toDataURL('image/jpeg', 0.7);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('DeliveryTicket.pdf');
        }
    };

    return (
        <div>
            <div ref={deliveryRef}>
                <Box sx={{ padding: '1.5rem' }}>
                    <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
                        <Grid container sx={{ marginBottom: '20px' }}>
                            {/* Left Section */}
                            <Grid item xs={6} sx={{ textAlign: 'left' }}>
                                <img
                                    src={Logo}
                                    alt="Better Day Energy Logo"
                                    style={{ width: '50%', marginBottom: '0.1rem' }}
                                />
                                <Typography variant="body1" sx={{ lineHeight: 1.5, fontWeight: 'bold', fontSize: '0.92rem', marginTop: '1rem', marginLeft: '40px' }}>
                                    American Petroleum
                                </Typography>
                                <Typography variant="body1" sx={{ lineHeight: 1.5, fontSize: '0.82rem', marginLeft: '40px' }}>
                                    140 Enterprise Parkway
                                </Typography>
                                <Typography variant="body1" sx={{ marginLeft: '40px' }}>Boerne, TX, USA</Typography>
                            </Grid>



                            {/* Right Section */}
                            <Grid item xs={6} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', }}>
                                <Typography variant="subtitle1" sx={{ fontSize: '15px', marginTop: '2.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <span style={{ fontWeight: 'bold', width: '115px', fontSize: '0.92rem' }}>SO Order No.:</span>
                                        <span style={{ fontSize: '0.92rem' }}>{delivertTicketList?.DTOrderNo || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <span style={{ fontWeight: 'bold', width: '115px', fontSize: '0.92rem' }}>Arrived At:</span>
                                        <span style={{ fontSize: '0.92rem' }}>{moment.utc(delivertTicketList?.ArrivedAt).format('MM/DD/YYYY hh:mm A') || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <span style={{ fontWeight: 'bold', width: '115px', fontSize: '0.92rem' }}>Completed:</span>
                                        <span style={{ fontSize: '0.92rem' }}>{moment.utc(delivertTicketList?.Completed).format('MM/DD/YYYY hh:mm A') || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <span style={{ fontWeight: 'bold', width: '115px', fontSize: '0.92rem' }}>Delivered By:</span>
                                        <span style={{ fontSize: '0.92rem' }}>{delivertTicketList?.DeliveredBy || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <span style={{ fontWeight: 'bold', width: '115px', fontSize: '0.92rem' }}>Truck#:</span>
                                        <span style={{ fontSize: '0.92rem' }}>{delivertTicketList?.DTTruck || 'N/A'}</span>
                                    </div>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{ marginBottom: '10px' }} />


                        <Grid container spacing={3} sx={DeliveryBillStyles}>
                            <Grid item xs={4} sx={{ padding: '0rem !important' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Bill To:</Typography>
                                {delivertTicketList ? (
                                    <div>
                                        <Typography variant="body1"> {delivertTicketList?.BillTo?.split(",")[0] || 'N/A'}</Typography>

                                    </div>
                                ) : (
                                    <Typography variant="body2">Loading Bill To Address...</Typography>
                                )}
                            </Grid>
                            <Grid xs={4}></Grid>

                            <Grid item xs={4} sx={{ textAlign: 'right', padding: '0rem !important' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Delivery Address:</Typography>
                                {delivertTicketList ? (
                                    <div>
                                        <Typography variant="body1"> {(() => {
                                            const deliveryTo = delivertTicketList.DeliveryTo || '';
                                            const line1Match = deliveryTo.match(/Line1='([^']*)'/)?.[1] || 'N/A';
                                            const stateMatch = deliveryTo.match(/StatesFId=(\d+)/)?.[1] || 'N/A';
                                            const cityMatch = deliveryTo.match(/CitiesFId=(\d+)/)?.[1] || 'N/A';
                                            const stateName = getStateNameById(Number(stateMatch));
                                            const cityName = getCityNameById(Number(cityMatch));
                                            return `${line1Match}, ${cityName}, ${stateName}`;
                                        })()}
                                        </Typography>

                                    </div>
                                ) : (
                                    <Typography variant="body2">Loading Ship To Address...</Typography>
                                )}
                            </Grid>
                        </Grid>


                    </Grid>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={deliveryTableCellStyles}>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.8rem', width: '20%' }}>Item</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', width: '50%', textAlign: 'center' }}>Description</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', width: '30%', textAlign: 'right' }}>
                                        Delivered Quantity (gal)
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {delivertTicketList?.ProductsDetail && (
                                    <>
                                        {delivertTicketList?.ProductsDetail.map((asset: any, index: number) => {
                                            const productDetails = productList.find((option) => option.Id === asset.ProductId);
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ fontSize: '0.8rem', width: '20%' }}>
                                                        {asset.ProductName || 'N/A'}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.8rem', width: '50%', textAlign: 'center' }}> {productDetails ? productDetails.SaleDesc : 'No Description Available'}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.8rem', width: '30%', textAlign: 'right' }}>
                                                        {asset.DeliveredQuantity || 0}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}

                                        {/* Calculate the total and add a summary row */}
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.8rem', width: '20%' }}>
                                                <strong>Total</strong>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', width: '50%' }}></TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', width: '30%', textAlign: 'right' }}>
                                                <strong>
                                                    {delivertTicketList?.ProductsDetail.reduce(
                                                        (total: number, asset: any) => total + (asset.DeliveredQuantity || 0),
                                                        0
                                                    )}
                                                </strong>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Divider sx={{ marginBottom: '25px' }} />

                    {delivertTicketList?.OtherChargesDetail?.length > 0 && (
                        <>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={deliveryTableCellStyles}>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.8rem', width: '15%' }}>Fee</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', width: '35%', textAlign: 'center' }}>Quantity</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', width: '35%', textAlign: 'center' }}>Unit Price</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', width: '15%', textAlign: 'right' }}>Total Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {delivertTicketList?.OtherChargesDetail.map((asset: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontSize: '0.8rem', width: '15%' }}>{asset.OtherChargesName || 'N/A'}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem', width: '35%', textAlign: 'center' }}>{asset.Quantity || 0}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem', width: '35%', textAlign: 'center' }}>{asset.UnitPrice || 0}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem', width: '15%', textAlign: 'right' }}>{asset.Amount || 0}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </>
                    )}


                    {/* <Divider sx={{ marginBottom: '25px' }} /> */}

                    {delivertTicketList?.AssetsDetail?.length > 0 && (
                        <>
                            <Typography sx={{ marginBottom: '25px', marginTop: '25px' }} variant="h6">Delivered Asset:</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={deliveryTableCellStyles}>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.8rem', width: '20%' }}>Asset Name</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', width: '50%', textAlign: 'center' }}>Product Name</TableCell>

                                            <TableCell sx={{ fontSize: '0.8rem', width: '30%', textAlign: 'right' }}>Delivered Quantity (gal)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {delivertTicketList?.AssetsDetail.map((asset: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontSize: '0.8rem', width: '20%' }}>{asset.AssetName || 'N/A'}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem', width: '50%', textAlign: 'center' }}>{asset.ProductName || 'N/A'}</TableCell>

                                                <TableCell sx={{ fontSize: '0.8rem', width: '30%', textAlign: 'right' }}>{asset.DeliveredQuantity || 0}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}


                </Box>
            </div >
            <Box sx={{ textAlign: 'right', marginTop: '20px' }}>
                <Button variant="contained" onClick={handleDownloadPDF}>
                    Download PDF
                </Button>
            </Box>
        </div >
    );
};

export default DeliveryTicketPage;