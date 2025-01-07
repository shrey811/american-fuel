import React, { useRef } from 'react';
import Button from 'components/Button/Button';
import {
  Box,
  Divider,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  invoiceGridStyles,
  ordersStyles,
  ShipBillStyles,
  tableCellStyles,
  headTableCellStyles,
  taxTableCellStyles,
  TaxHeaderCellStyles,
} from './styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';

interface Props {
  invoiceData?: any;
}

const PurchaseOrderInvoice = (props: Props) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  console.log({ CCCCCCCCCCCCCCC: props.invoiceData });
  const handleDownloadInvoice = async () => {
    const invoiceElement = invoiceRef.current;
    if (invoiceElement) {
      const canvas = await html2canvas(invoiceElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('PurchaseOrderInvoice.pdf');
    }
  };

  return (
    <>
      <div ref={invoiceRef}>
        <Box sx={{ padding: '1.5rem' }}>
          <Grid container spacing={3}>
            <Grid item xs={4} sx={{ padding: '1rem 1.5rem !important' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d1' }}>American Petroleum</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5">Purchase Order</Typography>
            </Grid>
            <Grid item xs={4} sx={{ paddingLeft: '0rem !important' }}>
              {/* <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Purchase Order</Typography> */}
              <Typography variant="body1">
                <span style={{ fontSize: '0.84rem' }}>
                  <strong> Doc Number:</strong> &nbsp;&nbsp;&nbsp;
                </span>{props.invoiceData.DocNumber}
              </Typography>
              <Typography variant="body1">
                <span style={{ fontSize: '0.84rem' }}>
                  <strong>Driver:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span> {props.invoiceData.Driver}
              </Typography>
              <Typography variant="body1">
                <span style={{ fontSize: '0.84rem' }}>
                  <strong> Lift Date/Time: </strong>&nbsp;
                </span>
                {/* {props.invoiceData.LiftDateTime} */}
                {moment(props.invoiceData.LiftDateTime).utc().format('ddd, MM/DD/YYYY hh:mm A')}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={ShipBillStyles}>
            <Grid item xs={6} sx={{ padding: '0rem !important' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Bill To:</Typography>
              <Typography variant="body1">Better Day Energy LLC</Typography>
              <Typography variant="body2">3812 Hwy Z</Typography>
              <Typography variant="body2">Hillsboro, MO 63050</Typography>
            </Grid>
            <Grid item xs={6} sx={{ padding: '0rem !important' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ship To:</Typography>
              <Typography variant="body1">ID: 108293004</Typography>
              <Typography variant="body2">6-6PM - IL</Typography>
              <Typography variant="body2">Lockport, IL 60441</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={ordersStyles}>
            <Grid item xs={4} sx={{ padding: '0rem !important' }}>
              <Typography><strong style={{ marginRight: '1.8rem', fontSize: '0.8rem' }}> Order No:</strong>{props.invoiceData.DocNumber}</Typography>
              {/* <Typography sx={{ marginTop: '0.6rem' }}>
                <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> Salesperson:</strong>Joe Trost</Typography> */}
            </Grid>
            <Grid item xs={4} sx={{ padding: '0rem !important' }}>
              <Typography>
                <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> Reference No.:</strong>N/A</Typography>
            </Grid>
            <Grid item xs={4} sx={{ padding: '0rem !important' }}>
              <Typography>
                <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> P.O. No:</strong>N/A</Typography>
            </Grid>
          </Grid>

          {/* <Grid container spacing={3} sx={{ marginLeft: '0px', width: '100%' }}>
            <Grid item xs={6} sx={invoiceGridStyles}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Purchase Order</Typography>
              <Typography variant="body1">
                <span>Doc Number: </span>{props.invoiceData.DocNumber}
              </Typography>
              <Typography variant="body1">
                <span>Driver: </span> {props.invoiceData.Driver}
              </Typography>
              <Typography variant="body1">
                <span>Lift Date/Time:</span>{props.invoiceData.LiftDateTime}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={invoiceGridStyles} style={{ textAlign: 'right' }}>
              <Typography variant="body1">Vendor ID: {props.invoiceData.VendorsFId}</Typography>
              <Typography variant="body1">PO Status: {props.invoiceData.POStatus}</Typography>
            </Grid>
          </Grid> */}

          {/* <Grid container spacing={3} sx={{ marginTop: '20px', marginLeft: '-8px !important' }}>
          <Grid item xs={12} sx={invoiceGridStyles}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: '10px' }}>Address</Typography>
            <TableContainer component={Paper} style={{ marginTop: '0px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Country</TableCell>
                    <TableCell>Country Sub Division Code</TableCell>
                    <TableCell>Bill Address</TableCell>
                    <TableCell>Ship Address</TableCell>
                    <TableCell>Postal Code</TableCell>
                    <TableCell>Zip</TableCell>
                    <TableCell>Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.invoiceData.Addresses && props.invoiceData.Addresses.length > 0 ? (
                    props.invoiceData.Addresses.map((item: any) => (
                      <TableRow key={item.Id}>
                        <TableCell>{item.Country}</TableCell>
                        <TableCell>{item.CountrySubDivisionCode}</TableCell>
                        <TableCell>{item.IsBill}</TableCell>
                        <TableCell>{item.IsShip}</TableCell>
                        <TableCell>{item.PostalCode}</TableCell>
                        <TableCell>{item.Zip}</TableCell>
                        <TableCell>{item.Note}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} style={{ textAlign: 'center' }}>No data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid> */}

          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead sx={headTableCellStyles}>
                <TableRow>
                  <TableCell sx={TaxHeaderCellStyles}>Description</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>BOL NO</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Gross Units</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Net Units</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Basis</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Unit Price</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.invoiceData.Products.map((item: any) => (
                  <TableRow key={item.Id}>
                    <TableCell sx={tableCellStyles}>{item.ProductsFId}</TableCell>
                    <TableCell sx={tableCellStyles}>{props.invoiceData.BOL}</TableCell>
                    <TableCell sx={tableCellStyles}>{item.UnitRate}</TableCell>
                    <TableCell sx={tableCellStyles}>{item.Amount}</TableCell>
                    <TableCell sx={tableCellStyles}>{item.TaxAmount}</TableCell>
                    <TableCell sx={tableCellStyles}>N/A</TableCell>
                    <TableCell sx={tableCellStyles}>N/A</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead sx={headTableCellStyles}>
                <TableRow>
                  <TableCell sx={TaxHeaderCellStyles}>Product ID</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Volume</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Unit Rate</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Amount</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Tax Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.invoiceData.Products.map((item: any) => (
                  <TableRow key={item.Id}>
                    <TableCell sx={tableCellStyles}>{item.ProductsFId}</TableCell>
                    <TableCell sx={tableCellStyles}>{item.ProductVolume}</TableCell>
                    <TableCell sx={tableCellStyles}>{item.UnitRate}</TableCell>
                    <TableCell sx={tableCellStyles}>{item.Amount}</TableCell>
                    <TableCell sx={tableCellStyles}>{item.TaxAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead sx={headTableCellStyles}>
                <TableRow>
                  <TableCell sx={TaxHeaderCellStyles}>Tax Name</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Tax Amount</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Tax Product Volume</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Tax Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.invoiceData.Products.some((item: any) => item.TaxesDetails && item.TaxesDetails.length > 0) ? (
                  props.invoiceData.Products.map((item: any) =>
                    item.TaxesDetails ? (
                      item.TaxesDetails.map((taxDetail: any, index: number) => (
                        <TableRow key={`${item.Id}-${index}`}>
                          <TableCell sx={taxTableCellStyles}>{taxDetail.TaxName}</TableCell>
                          <TableCell sx={taxTableCellStyles}>{taxDetail.TaxAmount}</TableCell>
                          <TableCell sx={taxTableCellStyles}>{taxDetail.TaxProductVolume}</TableCell>
                          <TableCell sx={taxTableCellStyles}>{taxDetail.TaxRate}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow key={item.Id}>
                        <TableCell sx={taxTableCellStyles}>N/A</TableCell>
                        <TableCell sx={taxTableCellStyles}>N/A</TableCell>
                        <TableCell sx={taxTableCellStyles}>N/A</TableCell>
                        <TableCell sx={taxTableCellStyles}>N/A</TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell sx={taxTableCellStyles}>N/A</TableCell>
                    <TableCell sx={taxTableCellStyles}>N/A</TableCell>
                    <TableCell sx={taxTableCellStyles}>N/A</TableCell>
                    <TableCell sx={taxTableCellStyles}>N/A</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={3} sx={invoiceGridStyles} style={{ marginTop: '20px' }}>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <Typography variant="h6">Total Amount: {props.invoiceData.TotalAmt}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ py: 1 }} />
      </div>
      <Grid container spacing={3} style={{ marginTop: '3px', textAlign: 'right' }}>
        <Grid item xs={12} sx={{ paddingTop: '1px!important' }}>
          <Button variant="contained" color="primary" onClick={handleDownloadInvoice}>Download PDF</Button>
        </Grid>
      </Grid>
    </>
  );
};

export default PurchaseOrderInvoice;




// PA_Expense_FId: 185
// PA_Income_FId:186
// TaxAmount:693
// TaxName:"SSSBBB"
// TaxProductVolume:21
// TaxRate:21