import React, { useEffect, useMemo, useRef } from 'react';
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
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { shallowEqual } from 'react-redux';
import Logo from '../../../assets/americanpetroleum.png'
interface Props {
  invoiceData?: any;
}

function numberToWords(num: number): string {
  const belowTwenty: string[] = [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'
  ];
  const tens: string[] = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];
  const aboveThousand: string[] = ['Hundred', 'Thousand', 'Million'];

  function integerToWords(n: number): string {
    if (n < 20) return belowTwenty[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + belowTwenty[n % 10] : '');
    if (n < 1000) return belowTwenty[Math.floor(n / 100)] + ' ' + aboveThousand[0] + (n % 100 !== 0 ? ' and ' + integerToWords(n % 100) : '');
    if (n < 1000000) return integerToWords(Math.floor(n / 1000)) + ' ' + aboveThousand[1] + (n % 1000 !== 0 ? ' ' + integerToWords(n % 1000) : '');

    return '';
  }

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let words = integerToWords(integerPart) + (integerPart === 1 ? ' dollar' : ' dollars');

  if (decimalPart > 0) {
    words += ' and ' + integerToWords(decimalPart) + (decimalPart === 1 ? ' cent' : ' cents');
  }

  return words;
}



const SalesOrderInvoice = (props: Props) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  console.log('invoiceData', props.invoiceData)
  const handleDownloadInvoice = async () => {
    const invoiceElement = invoiceRef.current;
    if (invoiceElement) {
      const canvas = await html2canvas(invoiceElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/jpeg', 0.7); // JPEG format with 70% quality
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST'); // Compress
      pdf.save('SalesOrderInvoice.pdf');
    }
  };


  const formatNumberWithCommas = (number: number) => {
    if (typeof number === 'number') {
      const [integerPart, decimalPart] = number.toString().split('.');
      // Format the integer part with commas
      const formattedIntegerPart = new Intl.NumberFormat('en-IN').format(Number(integerPart));
      // If the decimal part exists and has more than 6 digits, fix it to 6 digits
      if (decimalPart && decimalPart.length > 2) {
        return `${formattedIntegerPart}.${decimalPart.slice(0, 2)}`;
      } else if (decimalPart) {
        return `${formattedIntegerPart}.${decimalPart}`;
      } else {
        return formattedIntegerPart;
      }
    }
    return number;
  };
  const formatNumber = (number: number) => {
    return (formatNumberWithCommas(number));
  };

  const [billToAddressListData, billToAddressDataLoading] = useAppSelector(
    (state) => [
      state.addressReducers.billToAddressListData,
      state.addressReducers.billToAddressDataLoading
    ],
    shallowEqual
  );


  const [customerList, listcustomerLoading] = useAppSelector(
    (state) => [
      state.customerReducers.customerList,
      state.customerReducers.listcustomerLoading
    ],
    shallowEqual
  );


  const [shipToAddressListData, shipToAddressDataLoading] = useAppSelector(
    (state) => [
      state.shipToAddressReducers.shipToAddressListData,
      state.shipToAddressReducers.shipToAddressDataLoading
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

  const findCustomerName = (customerId: any) => {
    const customer = customerList.find(item => item.Id === customerId);
    return customer ? customer.DisplayName : '';
  };

  const totalTaxAmount = useMemo(() => {
    return props.invoiceData.Products.reduce((sum: any, item: any) => {
      if (item.TaxesDetails && item.TaxesDetails.length > 0) {
        return sum + item.TaxesDetails.reduce((taxSum: any, tax: any) => taxSum + tax.TaxAmount, 0);
      }
      return sum;
    }, 0);
  }, [props.invoiceData.Products]);

  const { totalGrossQuantity, totalNetQuantity, subtotalAmount } = useMemo(() => {
    return props.invoiceData.Products.reduce(
      (totals: any, item: any) => {
        totals.subtotalAmount += item.Amount;
        totals.totalGrossQuantity += item.GrossQuantity;
        totals.totalNetQuantity += item.NetQuantity;
        return totals;
      },
      { subtotalAmount: 0, totalGrossQuantity: 0, totalNetQuantity: 0 }
    );
  }, [props.invoiceData.Products]);

  // Utility function to find city or state name by ID
  const getCityNameById = (id: number) => {
    const city = cityList.find((city: any) => city.Id === id);
    return city ? city.Name : 'N/A';
  };

  const getStateNameById = (id: number) => {
    const state = stateListData.find((state: any) => state.Id === id);
    return state ? state.Name : 'N/A';
  };

  return (
    <>
      <div ref={invoiceRef}>
        <Box sx={{ padding: '1.5rem' }}>
          <Grid container spacing={3}>
            <Grid item xs={4} sx={{ padding: '1rem 1.5rem !important' }}>
              <img src={Logo} alt="Better Day Energy Logo" style={{ width: '50%', }} />
              {/* <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d1' }}>Better Day Energy</Typography> */}
            </Grid>
            <Grid item xs={4}>
              {/* <Typography variant="h5">Sales Ordersssss</Typography> */}
            </Grid>
            <Grid item xs={4} sx={{ paddingLeft: '0rem !important', marginTop: '20px', marginBottom: '30px' }}>
              {/* <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Purchase Order</Typography> */}

              <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '115px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Doc Number:</span>
                <span style={{ fontSize: '0.72rem' }}>{props.invoiceData.DocNumber}</span>
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '115px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Invoice Date:</span>
                <span style={{ fontSize: '0.72rem' }}>{moment(props.invoiceData.InvoiceDateTime).utc().format('ddd, MM/DD/YYYY hh:mm A')}</span>
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '115px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Delivery Date:</span>
                <span style={{ fontSize: '0.72rem' }}>{moment(props.invoiceData.InvoiceDateTime).utc().format('ddd, MM/DD/YYYY hh:mm A')}</span>
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '115px', fontWeight: 'bold', textAlign: 'end', paddingRight: '1rem', fontSize: '0.8rem' }}>Lift Date:</span>
                <span style={{ fontSize: '0.72rem' }}>{moment(props.invoiceData.InvoiceDateTime).utc().format('ddd, MM/DD/YYYY hh:mm A')}</span>
              </Typography>

            </Grid>
          </Grid>
          <Grid container spacing={3} sx={ShipBillStyles}>
            <Grid item xs={4} sx={{ padding: '0rem !important' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Bill To:</Typography>
              {billToAddressListData ? (
                <div>
                  <Typography variant="body1">{findCustomerName(props.invoiceData.CustomersFId)}</Typography>
                  <Typography variant="body1">{billToAddressListData.Line1}, {billToAddressListData.Line2}</Typography>

                  <Typography variant="body2">
                    {`${getCityNameById(billToAddressListData.CitiesFId)}, ${getStateNameById(billToAddressListData.StatesFId)}`}
                  </Typography>
                </div>
              ) : (
                <Typography variant="body2">Loading Bill To Address...</Typography>
              )}
            </Grid>
            <Grid xs={4}></Grid>
            {/* <Grid item xs={6} sx={{ padding: '0rem !important' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ship To:</Typography>
              <Typography variant="body1">ID: 108293004</Typography>
              <Typography variant="body2">6-6PM - IL</Typography>
              <Typography variant="body2">Lockport, IL 60441</Typography>
            </Grid> */}
            <Grid item xs={4} sx={{ padding: '0rem !important' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Ship To:</Typography>
              {shipToAddressListData ? (
                <div>
                  <Typography variant="body1">{shipToAddressListData.Line1}, {shipToAddressListData.Line2}</Typography>
                  <Typography variant="body2">
                    {`${getCityNameById(shipToAddressListData.CitiesFId)}, ${getStateNameById(shipToAddressListData.StatesFId)}`}
                  </Typography>
                </div>
              ) : (
                <Typography variant="body2">Loading Ship To Address...</Typography>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={ordersStyles}>
            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
              <Typography><strong style={{ marginRight: '0.8rem', fontSize: '0.8rem' }}> Order No:</strong>{props.invoiceData.DocNumber}</Typography>
              {/* <Typography sx={{ marginTop: '0.6rem' }}>
                <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> Salesperson:</strong>Joe Trost</Typography> */}
            </Grid>
            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
              <Typography>
                <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> Reference No.:</strong></Typography>
            </Grid>
            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
              <Typography>
                <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> P.O. No:</strong></Typography>
            </Grid>
            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
              <Typography>
                <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> P.Term:</strong></Typography>
            </Grid>
          </Grid>
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead sx={headTableCellStyles}>
                <TableRow>
                  <TableCell sx={TaxHeaderCellStyles}>Description</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>BOL</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Gross Units</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Net Units</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Basis</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Unit Rate</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Freight Rate</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.invoiceData.Products.map((item: any) => {
                  const productDetails = productList.find((option) => option.Id === item.ProductsFId);
                  return (
                    <TableRow key={item.Id}>
                      <TableCell sx={tableCellStyles}> {productDetails ? productDetails.SaleDesc : 'No Description Available'}</TableCell>
                      <TableCell sx={tableCellStyles}>{item.BOl}</TableCell>
                      <TableCell sx={tableCellStyles}>{item.GrossQuantity}</TableCell>
                      <TableCell sx={tableCellStyles}>{item.NetQuantity}</TableCell>
                      <TableCell sx={tableCellStyles}>{item.Basis}</TableCell>
                      <TableCell sx={tableCellStyles}>{item.UnitRate}</TableCell>
                      <TableCell sx={tableCellStyles}>{item.FreightAmount}</TableCell>
                      <TableCell sx={tableCellStyles}>{formatNumber(item.Amount)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>

            </Table>
          </TableContainer>
          <Divider />
          <Grid container spacing={3} sx={invoiceGridStyles} style={{ marginTop: '1px' }}>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <Typography sx={{ fontWeight: 'bold' }} variant="body1">Sub Total: ${formatNumber(subtotalAmount)}</Typography>
            </Grid>
          </Grid>
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead sx={headTableCellStyles}>
                <TableRow>
                  <TableCell sx={TaxHeaderCellStyles}>Tax & Other Charges Summary</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}> Quantity</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}> Rate</TableCell>
                  <TableCell sx={TaxHeaderCellStyles}> Amount</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {props.invoiceData.Products.some((item: any) => item.TaxesDetails && item.TaxesDetails.length > 0) ? (
                  props.invoiceData.Products.map((item: any) =>
                    item.TaxesDetails?.map((tax: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell sx={taxTableCellStyles}>{tax.TaxName}</TableCell>
                        <TableCell sx={taxTableCellStyles}>{tax.TaxBilledQuantity}</TableCell>
                        <TableCell sx={taxTableCellStyles}>{tax.TaxRate}</TableCell>
                        <TableCell sx={taxTableCellStyles}>{formatNumber(tax.TaxAmount)}</TableCell>
                      </TableRow>
                    ))
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center' }}>No tax details available</TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </TableContainer>
          <Divider />
          <Grid container spacing={3} sx={invoiceGridStyles} style={{ marginTop: '1px' }}>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <Typography sx={{ fontWeight: 'bold' }} variant="body1">Sub Total:${formatNumber(totalTaxAmount)}</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={ordersStyles}>
            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
              <Typography><strong style={{ marginRight: '1.8rem', fontSize: '0.8rem' }}> Invoice Total:</strong></Typography>
            </Grid>

            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
              <Typography>
                <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> Gross:</strong>{totalGrossQuantity}</Typography>
            </Grid>

            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
              <Typography>
                <strong style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}> Net:</strong>{totalNetQuantity}
              </Typography>
            </Grid>

            <Grid item xs={3} sx={{ padding: '0rem !important' }}>
              <Typography><strong style={{ marginRight: '1.8rem', fontSize: '0.8rem' }}> ${formatNumber(props.invoiceData.TotalAmt)}</strong></Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={ordersStyles}>
            <Typography>
              <strong style={{ marginRight: '0.8rem', fontSize: '0.8rem' }}>Total in Words:</strong>
              {numberToWords(props.invoiceData.TotalAmt)} Only
            </Typography>
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

export default SalesOrderInvoice;