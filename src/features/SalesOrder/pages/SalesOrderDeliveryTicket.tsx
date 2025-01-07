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
import { DeliveryBillStyles, deliverysStyles, headTableCellStyles, ordersStyles, ShipBillStyles } from './styles';

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

                        <Grid container spacing={3}>
                            <Grid item xs={4} sx={{ padding: '1rem 1.5rem !important', textAlign: 'center' }}>
                                <img
                                    src={Logo}
                                    alt="Better Day Energy Logo"
                                    style={{ width: '50%', marginBottom: '0.5rem' }}
                                />
                                <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
                                    140 Enterprise Parkway, Boerne, TX, USA
                                </Typography>
                                <Typography variant="body1">8304311024</Typography>
                            </Grid>

                            <Grid item xs={4}>

                            </Grid>
                            <Grid item xs={4} sx={{ paddingLeft: '0rem !important', marginTop: '20px', marginBottom: '30px' }}>
                                <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: '115px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>SO Order No.:</span>
                                    <span style={{ fontSize: '0.72rem' }}>{delivertTicketList?.DTOrderNo || 'N/A'}</span>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: '115px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Arrived At:</span>
                                    <span style={{ fontSize: '0.72rem' }}>{moment.utc(delivertTicketList?.ArrivedAt).format('MM/DD/YYYY hh:mm A') || 'N/A'}</span>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: '115px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Completed:</span>
                                    <span style={{ fontSize: '0.72rem' }}>{moment.utc(delivertTicketList?.Completed).format('MM/DD/YYYY hh:mm A') || 'N/A'}</span>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: '115px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Delivered By:</span>
                                    <span style={{ fontSize: '0.72rem' }}>{delivertTicketList?.DeliveredBy || 'N/A'}</span>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: '115px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Truck#:</span>
                                    <span style={{ fontSize: '0.72rem' }}>{delivertTicketList?.DTTruck || 'N/A'}</span>
                                </Typography>
                            </Grid>
                        </Grid>
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

                            <Grid item xs={4} sx={{ padding: '0rem !important' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Ship To:</Typography>
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
                        {/* <Grid container spacing={3} sx={deliverysStyles}>
                            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
                                <Typography><strong style={{ marginRight: '0.8rem', fontSize: '0.8rem' }}> Delivery Ticket</strong></Typography>

                            </Grid>
                            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
                                <Typography>
                                    <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> Delivered By:</strong> {delivertTicketList?.DeliveredBy || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
                                <Typography>
                                    <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> SO Order No.:</strong> {delivertTicketList?.DTOrderNo || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
                                <Typography>
                                    <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> Truck#:</strong> {delivertTicketList?.DTTruck || 'N/A'}</Typography>
                            </Grid>

                        </Grid> */}

                    </Grid>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={headTableCellStyles}>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.8rem' }}>Product Name</TableCell>

                                    <TableCell sx={{ fontSize: '0.8rem' }}>Delivered Quantity (gal)</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {delivertTicketList?.ProductsDetail && (
                                    <>
                                        {delivertTicketList?.ProductsDetail.map((asset: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{asset.ProductName || 'N/A'}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{asset.DeliveredQuantity || 0}</TableCell>
                                            </TableRow>
                                        ))}

                                        {/* Calculate the total and add a summary row */}
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.8rem' }}><strong>Total</strong></TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>
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
                    {/* <Divider sx={{ marginBottom: '25px' }} /> */}

                    {delivertTicketList?.AssetsDetail?.length > 0 && (
                        <>
                            <Typography sx={{ marginBottom: '25px', marginTop: '25px' }} variant="h6">Breakdown By Asset:</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={headTableCellStyles}>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>Product Name</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>Asset Name</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>Delivered Quantity (gal)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {delivertTicketList?.AssetsDetail.map((asset: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{asset.ProductName || 'N/A'}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{asset.AssetName || 'N/A'}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{asset.DeliveredQuantity || 0}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}


                </Box>
            </div>
            <Box sx={{ textAlign: 'right', marginTop: '20px' }}>
                <Button variant="contained" onClick={handleDownloadPDF}>
                    Download PDF
                </Button>
            </Box>
        </div>
    );
};

export default DeliveryTicketPage;
