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
                        <Grid item xs={12} sx={{ textAlign: 'center', marginBottom: '60px' }}>
                            <img
                                src={Logo}
                                alt="Better Day Energy Logo"
                                style={{ width: '20%', marginBottom: '0.5rem' }}
                            />
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#BC1B21' }}>
                                Delivery Receipt
                            </Typography>

                        </Grid>
                        <Grid container spacing={3} sx={DeliveryBillStyles}>
                            <Grid item xs={4} sx={{ padding: '0rem !important' }}>
                                <Typography variant="body1" sx={{ lineHeight: 1.5, fontWeight: 'bold', fontSize: '0.92rem' }}>
                                    American Petroleum
                                </Typography>
                                <Typography variant="body1" sx={{ lineHeight: 1.5, fontSize: '0.82rem' }}>
                                    65th AveNe
                                </Typography>
                                <Typography variant="body1">Boeran,Tx 98105</Typography>
                            </Grid>

                            <Grid item xs={4}>

                            </Grid>
                            <Grid item xs={4} sx={{ padding: '0rem !important' }}>
                                <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', width: '115px', fontSize: '0.8rem' }}>SO Order No.:</span>
                                        <span style={{ fontSize: '0.72rem' }}>{delivertTicketList?.DTOrderNo || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', width: '115px', fontSize: '0.8rem' }}>Arrived At:</span>
                                        <span style={{ fontSize: '0.72rem' }}>{moment.utc(delivertTicketList?.ArrivedAt).format('MM/DD/YYYY hh:mm A') || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', width: '115px', fontSize: '0.8rem' }}>Completed:</span>
                                        <span style={{ fontSize: '0.72rem' }}>{moment.utc(delivertTicketList?.Completed).format('MM/DD/YYYY hh:mm A') || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', }}>
                                        <span style={{ fontWeight: 'bold', width: '115px', fontSize: '0.8rem' }}>Delivered By:</span>
                                        <span style={{ fontSize: '0.72rem' }}>{delivertTicketList?.DeliveredBy || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', width: '115px', fontSize: '0.8rem' }}>Truck#:</span>
                                        <span style={{ fontSize: '0.72rem' }}>{delivertTicketList?.DTTruck || 'N/A'}</span>
                                    </div>
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
                                    <TableCell sx={{ fontSize: '0.8rem' }}>Item</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem' }}>Description</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem' }}>Delivered Quantity (gal)</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {delivertTicketList?.ProductsDetail && (
                                    <>
                                        {delivertTicketList?.ProductsDetail.map((asset: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{asset.ProductName || 'N/A'}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem' }}></TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem', paddingLeft: '8rem' }}>{asset.DeliveredQuantity || 0}</TableCell>
                                            </TableRow>
                                        ))}

                                        {/* Calculate the total and add a summary row */}
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.8rem' }}><strong>Total</strong></TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem' }}></TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', paddingLeft: '8rem' }}>
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
                            <Typography sx={{ marginBottom: '25px', marginTop: '25px' }} variant="h6">Delivered Asset:</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={deliveryTableCellStyles}>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>Asset Name</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>Product Name</TableCell>

                                            <TableCell sx={{ fontSize: '0.8rem' }}>Delivered Quantity (gal)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {delivertTicketList?.AssetsDetail.map((asset: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{asset.AssetName || 'N/A'}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{asset.ProductName || 'N/A'}</TableCell>

                                                <TableCell sx={{ fontSize: '0.8rem', paddingLeft: '8rem' }}>{asset.DeliveredQuantity || 0}</TableCell>
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
        </div >
    );
};

export default DeliveryTicketPage;
