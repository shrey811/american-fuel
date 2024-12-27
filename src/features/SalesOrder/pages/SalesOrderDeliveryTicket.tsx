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
                        {/* Logo and Address */}
                        <Grid item xs={6}>
                            <img
                                src={Logo} // Replace with the actual logo path
                                alt="Logo"
                                style={{ maxWidth: '150px' }}
                            />

                        </Grid>

                        {/* Delivery Ticket Details */}
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body1">
                                140 Enterprise Parkway, Boerne, TX, USA
                            </Typography>
                            <Typography variant="body1">8304311024</Typography>

                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="body1">
                                <strong>Bill To:</strong>
                                <br />
                                {delivertTicketList?.BillTo?.split(",")[0] || 'N/A'}
                            </Typography>

                            <Typography variant="body1">
                                <strong>Delivered To:</strong>{' '}
                                <br />
                                {(() => {
                                    const deliveryTo = delivertTicketList?.DeliveryTo || '';
                                    const line1Match = deliveryTo.match(/Line1='([^']*)'/)?.[1] || 'N/A';
                                    const stateMatch = deliveryTo.match(/StatesFId=(\d+)/)?.[1] || 'N/A';
                                    const cityMatch = deliveryTo.match(/CitiesFId=(\d+)/)?.[1] || 'N/A';
                                    const stateName = getStateNameById(Number(stateMatch));
                                    const cityName = getCityNameById(Number(cityMatch));
                                    return `${line1Match}, ${cityName}, ${stateName}`;
                                })()}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Arrived At:</strong>{' '}
                                {moment(delivertTicketList?.ArrivedAt).format('DD MMM YYYY hh:mm A') || 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Completed:</strong>{' '}
                                {moment(delivertTicketList?.Completed).format('DD MMM YYYY hh:mm A') || 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Delivered By:</strong> {delivertTicketList?.DTDriver || 'N/A'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>

                            <Typography variant="h6"><strong>Delivery Ticket</strong></Typography>
                            <Typography variant="body1">
                                <strong>SO Order No.:</strong> {delivertTicketList?.DTOrderNo || 'N/A'}
                            </Typography>
                            {/* <Typography variant="body1">
                                <strong>Customer No.:</strong> {delivertTicketList?.CustomerNo || 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                <strong>ShipTo No.:</strong> {delivertTicketList?.ShipToNo || 'N/A'}
                            </Typography> */}
                            <Typography variant="body1">
                                <strong>Truck#:</strong> {delivertTicketList?.DTTruck || 'N/A'}
                            </Typography>
                            {/* <Typography variant="body1">
                                <strong>Driver:</strong> {delivertTicketList?.DTDriver || 'N/A'}
                            </Typography> */}
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginBottom: '20px' }} />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Name</TableCell>
                                    {/* <TableCell>Asset Name</TableCell> */}
                                    <TableCell>Delivered Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {delivertTicketList?.ProductsDetail && (
                                    <>
                                        {delivertTicketList.ProductsDetail.map((asset: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{asset.ProductName || 'N/A'}</TableCell>
                                                <TableCell>{asset.DeliveredQuantity || 0}</TableCell>
                                            </TableRow>
                                        ))}

                                        {/* Calculate the total and add a summary row */}
                                        <TableRow>
                                            <TableCell><strong>Total</strong></TableCell>
                                            <TableCell>
                                                <strong>
                                                    {delivertTicketList.ProductsDetail.reduce(
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
                    <Divider sx={{ marginBottom: '20px' }} />
                    <Typography variant="h6">Breakdown By Asset:</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Asset Name</TableCell>
                                    <TableCell>Delivered Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {delivertTicketList?.AssetsDetail?.map((asset: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{asset.ProductName || 'N/A'}</TableCell>
                                        <TableCell>{asset.AssetName || 'N/A'}</TableCell>
                                        <TableCell>{asset.DeliveredQuantity || 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
