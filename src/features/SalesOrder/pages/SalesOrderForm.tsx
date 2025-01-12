import { Autocomplete, Box, Checkbox, Divider, FormControl, Collapse, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, Typography } from '@mui/material';

import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listCity } from 'store/slices/citySlice';
import { listCityState } from 'store/slices/cityStateSlice';
import { listProduct } from 'store/slices/productSlice';
import { filterRealTimeCost } from 'store/slices/realtimecostSlice';
import { stateList } from 'store/slices/stateSlice';
import { getFilterTax } from 'store/slices/taxSlice';
import { listAllTerminal } from 'store/slices/terminalSlice';
import { textFieldStyles, tableFormStyles } from './styles';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { addSalesOrder, filterSalesCost, listSalesOrder, updateSalesOrder } from 'store/slices/salesOrderSlice';
import { listCustomer } from 'store/slices/customerSlice';
import { CustomerDataType } from 'types/CustomerType';
import { listAdditionalCharges } from 'store/slices/additonalChargesSlice';
import { listAccount } from 'store/slices/accountSlice';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { filterFreightRule } from 'store/slices/freightRuleSlice';
import { idID } from '@mui/material/locale';
import { AdditionalChargesDataType } from 'types/AddiotnalChargesType';
import { getBillAddressCustomer } from 'store/slices/billaddressSlice';
import { getShipAddressCustomer } from 'store/slices/shipaddressSlice';
import { listCustomerAssest } from 'store/slices/customerassestsSlice';

interface Props {
    editData?: any;
    setEditData?: any;
    productList: { Id: string; Name: string }[];
    toggleForm: () => void;

}
interface SalesDetail {
    Name: string;
    Rate: number;
    Id: number;
    PA_Income_FId: number;
    PA_Expense_FId: number;
}

const salesOrderInitialValues = {
    OrderDateTime: '',
    ExpectedDateTime: '',
    InvoiceDateTime: '',
    InvoiceAddressFID: 0,
    DeliveryAddressFID: 0,
    InvoiceStatus: false,
    DeliveryStatus: false,
    CustomersFId: 0,
    TotalAmt: '',
    Truck: '',
    Driver: '',
    DeliveredBy: '',
    DocNumber: '',
    SOStatus: '',
    Products: [
        {
            ProductsFId: 0,
            GrossQuantity: 0,
            Basis: '',
            BilledQuantity: 0,
            NetQuantity: 0,
            UnitRate: 0,
            Amount: 0,
            Description: '',
            FreightAmount: 0,
            TaxAmount: 0,
            PurchaseDesc: '',
            SaleDesc: '',
            MeasurementUnit: '',
            TaxesDetails: [
                {
                    TaxName: '',
                    TaxRate: 0,
                    TaxBilledQuantity: 0,
                    TaxAmount: 0,
                    PA_Income_FId: 0,
                    PA_Expense_FId: 0
                }
            ],
            Id: 0,
        }
    ],
    OtherCharges: [
        {
            OCName: '',
            BilledQuantity: 0,
            UnitRate: 0,
            Amount: 0,
            OtherChargesFId: 0
        }
    ],
    DeliveryInfos: [
        {
            CustomersAssetFId: 0,
            ProductsFId: 0,
            DeliveryQuantity: 0,
            Rate: 0,
            Status: ''
        }
    ]

}

interface AddressType {
    Id: number;
    Line1: string;
    StatesFId: number;
    CitiesFId: number;
    Country: string;
    City: string;
    State: string;
}

const SalesOrderForm = (props: Props) => {

    const dispatch = useAppDispatch();

    // console.log({SalesOrder: props.editData})
    const [initialData, setInitialData] = useState<typeof salesOrderInitialValues>({
        ...salesOrderInitialValues,
        SOStatus: 'Opened',
        DeliveryStatus: false,
        InvoiceStatus: false,

    });
    const [openRows, setOpenRows] = useState<number[]>([]); // State to track open rows
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedTaxID, setSelectedTaxID] = useState<string | null>(null);
    const handleTabChange = (event: any, newValue: any) => {
        setTabIndex(newValue);
    };
    const [isFieldVisible, setIsFieldVisible] = useState(false);
    const [customerSelected, setCustomerSelected] = useState<boolean>(false);
    const [terminalSelected, setTerminalSelected] = useState<boolean>(false);
    const [salesDetails, setSalesDetails] = useState<{ [key: number]: SalesDetail[] }>({});
    const [additionalCharges, setAdditionalCharges] = useState([{ AdditionalChargeFId: 0, Price: 0, BilledQuantity: 0 }]);
    const [assestsCharges, setAssestCharges] = useState([{ CustomersAssetFId: 0, ProductsFId: 0, DeliveryQuantity: 0, Rate: 0, Status: true }]);
    const [formVisible, setFormVisible] = useState(true);
    const [invoiceAddressDisplay, setInvoiceAddressDisplay] = useState<string>('');
    const [deliveryAddressDisplay, setDeliveryAddressDisplay] = useState<AddressType | null>(null);
    const [taxRate, setTaxRate] = useState<any>([]);
    const [addressOptions, setAddressOptions] = useState<AddressType[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDataType | null>(null);
    const [invoiceAddress, setInvoiceAddress] = useState<AddressType | null>(null);
    const [deliveryAddress, setDeliveryAddress] = useState<AddressType | null>(null);
    const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [deliveryAddressOptions, setDeliveryAddressOptions] = useState([]);
    const [invoiceAddressOptions, setInvoiceAddressOptions] = useState([]);



    useEffect(() => {
        dispatch(listCustomer());
        dispatch(listAllTerminal());
        dispatch(listProduct());
        dispatch(listSalesOrder());
        dispatch(stateList());
        dispatch(listCity());
        dispatch(listAdditionalCharges());
        dispatch(listAccount());
        // dispatch(listFreightRule());

    }, []);



    const [accountListData, listAccountLoading] = useAppSelector(
        (state) => [
            state.accountReducers.accountListData,
            state.accountReducers.listAccountLoading
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

    const [stateListData, stateDataLoading] = useAppSelector(
        (state) => [
            state.stateReducers.stateListData,
            state.stateReducers.stateDataLoading
        ],
        shallowEqual
    );

    const [additionalchargesList, listAdditionalchargesLoading] = useAppSelector(
        (state) => [
            state.additionalChargeReducers.additionalchargesList,
            state.additionalChargeReducers.listAdditionalchargesLoading
        ],
        shallowEqual
    );
    const [freightList, freightListLoading] = useAppSelector(
        (state) => [
            state.freightReducers.freightRuleListData,
            state.freightReducers.freightLoading,
        ],
        shallowEqual
    );

    const [listCityies, listCityStateLoading] = useAppSelector(
        (state) => [
            state.cityStateReducers.cityStateList,
            state.cityStateReducers.listCityStateLoading
        ],
        shallowEqual
    );

    const [terminalList, terminalListLoading] = useAppSelector(
        (state) => [
            state.terminalReducers.terminalListData,
            state.terminalReducers.listTerminalLoading
        ],
        shallowEqual
    );
    const [customerAssestList, listCustomerAssestLoading] = useAppSelector(
        (state) => [
            state.customerAssestReducers.customerAssestList,
            state.customerAssestReducers.listCustomerAssestLoading,
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

    // const handleEditProduct = () => {
    //     if (!Array.isArray(initialData.DeliveryInfos)) return null;

    //     const productId = initialData.DeliveryInfos.find(info => info.ProductsFId)?.ProductsFId;
    //     if (props.editData) {
    //         return productList.find(item => item.Id === productId) || null;
    //     } else {
    //         return productId ? productList.find(item => item.Id === productId) || null : null;
    //     }
    // }
    const [salesOrderList, salesOrderListLoading] = useAppSelector(
        (state) => [
            state.salesOrderReducers.salesOrderList,
            state.salesOrderReducers.salesOrderListLoading,
        ],
        shallowEqual
    );


    useEffect(() => {
        const now = new Date().toISOString().slice(0, 16);
        setInitialData(prevState => ({
            ...prevState,
            ExpectedDateTime: now,
            OrderDateTime: now,
            InvoiceDateTime: now,
        }));

        // const calculateAmount = (index: number) => {
        //     const product = initialData.Products[index];
        //     const unitRate = product.UnitRate;
        //     const billedquantity = (product.BilledQuantity);
        //     const freight = product.FreightAmount;
        //     if (!isNaN(unitRate) && !isNaN(billedquantity)) {
        //         const amount1 = unitRate * billedquantity; // Calculate amount1
        //         const amount2 = freight * billedquantity;  // Calculate amount2

        //         // Compute the total amount as the sum of amount1 and amount2
        //         const amount = amount1 + amount2;
        //         const updatedProducts = [...initialData.Products];
        //         updatedProducts[index] = { ...product, Amount: amount.toFixed(2) };
        //         setInitialData({ ...initialData, Products: updatedProducts });
        //     }
        // };

        initialData.Products.forEach((_, index) => {
            calculateAmount(index);
        });
        // 
        if (props.editData) {
            setInitialData(props.editData);
        }
        if (props.editData) {
            setInitialData({
                ...props.editData,
                ExpectedDateTime: moment.utc(props.editData.ExpectedDateTime).format('YYYY-MM-DD HH:mm:ss'),
                OrderDateTime: moment.utc(props.editData.OrderDateTime).format('YYYY-MM-DD HH:mm:ss'),
                InvoiceDateTime: moment.utc(props.editData.InvoiceDateTime).format('YYYY-MM-DD HH:mm:ss')
            });

            if (props.editData.OtherCharges) {
                setAdditionalCharges(
                    props.editData.OtherCharges.map((charge: any) => ({
                        AdditionalChargeFId: charge.OtherChargesFId || 0,
                        Price: charge.UnitRate || 0,

                        BilledQuantity: charge.BilledQuantity || 0,

                    }))
                );
            }
        }
        if (props.editData) {
            const updatedProducts = props.editData.Products?.map((product: any) => {
                const updatedProduct: any = {
                    ...product,
                    ProductsFId: product.ProductsFId?.toString(),
                    TaxesDetails: product.TaxesDetails?.map((tax: any) => ({
                        TaxName: tax?.Name || '',
                        TaxRate: tax?.Rate || 0,
                        TaxBilledQuantity: tax?.TaxBilledQuantity || 0,
                        TaxAmount: tax?.TaxAmount || 0,
                        PA_Expense_FId: tax?.PA_Expense_FId || null,
                        PA_Income_FId: tax?.PA_Income_FId || null
                    })) || []
                };

                updatedProduct.ProductsCategoryFId = product?.ProductsCategoryFId || 0;

                return updatedProduct;
            }) || [];

            setInitialData(prevState => ({
                ...prevState,
                Products: updatedProducts,
            }));
        }

        if (props.editData) {
            // Find the customer based on CustomersFId from props.editData
            const customer = customerList.find(cust => cust.Id === props.editData.CustomersFId) || null;

            if (customer) {

                const addresses = customer.Address || [];

                const invoiceAddr = addresses.find(addr => addr.Id === props.editData.InvoiceAddressFID) || null;
                const deliveryAddr = addresses.find(addr => addr.Id === props.editData.DeliveryAddressFID) || null;
                console.log({ invoiceAddr });
                console.log({ deliveryAddr });

                setAddressOptions(addresses);
                setSelectedCustomer(customer);
                setInitialData(prevData => ({
                    ...prevData,
                    InvoiceAddressFID: invoiceAddr ? invoiceAddr.Id : 0,
                    DeliveryAddressFID: deliveryAddr ? deliveryAddr.Id : 0,
                    StateName: invoiceAddr ? getStateName(invoiceAddr.StatesFId) : '',
                    CityName: invoiceAddr ? getCityName(invoiceAddr.CitiesFId) : '',
                }));

                if (invoiceAddr) {
                    setSelectedStateId(invoiceAddr.StatesFId);
                    setSelectedCityId(invoiceAddr.CitiesFId);
                    setInvoiceAddress(invoiceAddr);
                }

                if (deliveryAddr) {
                    setSelectedStateId(deliveryAddr.StatesFId);
                    setSelectedCityId(deliveryAddr.CitiesFId);
                    setDeliveryAddress(deliveryAddr);
                }

            }
        }

        if (props.editData) {
            const updatedProducts = props.editData.Products.map((product: { ProductsFId: number; TaxesDetails: any; }, index: any) => {
                const selectedProduct = productList.find(p => p.Id === product.ProductsFId);
                return selectedProduct ? {
                    ...product,
                    Description: selectedProduct.Description,
                    ProductsCategoryFId: selectedProduct.ProductCategoryFId,
                    TaxesDetails: product.TaxesDetails || [], // Keep existing taxes or set empty array
                } : product;
            });
            setInitialData(prevData => ({
                ...prevData,
                Products: updatedProducts,
            }));
        }
    }, [props.editData, productList]);


    const handleChange = (event: any) => {
        const { name, value } = event.target;
        if (name === 'ProductsFId' || name === 'BilledQuantity' || name === 'UnitRate') {
            setInitialData(prevData => ({
                ...prevData,
                Products: [{
                    ...prevData.Products[0],
                    [name]: value
                }]
            }));
        } else {
            setInitialData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }

        if (name === 'CustomerFId') {
            // dispatch(listTerminal(value));
            setCustomerSelected(true);
        }
        if (name === 'TerminalsFId') {
            setTerminalSelected(true);
        }
    }


    const handleCustomerChange = async (event: any, value: any) => {
        const customerId = value ? value.Id : '';
        const addresses = value ? value.Address : [];
        setSelectedCustomer(value);
        setAddressOptions(addresses);

        const customerIdString = Number(customerId)
        const billingAddressesResponse = await dispatch(getBillAddressCustomer({ customer_bill_address_id: customerIdString }));
        const shippingAddressesResponse = await dispatch(getShipAddressCustomer({ customer_ship_address_id: customerId }));
        const customerAssest_id = customerId;
        dispatch(listCustomerAssest(customerAssest_id));
        const billingAddresses = billingAddressesResponse.payload.message.data || [];
        const shippingAddresses = shippingAddressesResponse.payload.message.data || [];

        setDeliveryAddressOptions(billingAddresses);
        setInvoiceAddressOptions(shippingAddresses);

        const defaultAddress = billingAddresses.length === 1 ? billingAddresses[0] : null;
        setInitialData(prevData => ({
            ...prevData,
            CustomersFId: customerId,
            InvoiceAddressFID: defaultAddress ? defaultAddress.Id : 0,
            DeliveryAddressFID: defaultAddress ? defaultAddress.Id : 0,
            StateName: defaultAddress ? getStateName(defaultAddress.StatesFId) : '',
            CityName: defaultAddress ? getCityName(defaultAddress.CitiesFId) : '',
        }));
    }

    const handleAddressChange = (type: 'Invoice' | 'Delivery') => (event: any, value: AddressType | null) => {
        const addressId = value ? value.Id : 0;
        const stateName = value ? getStateName(value.StatesFId) : '';
        const cityName = value ? getCityName(value.CitiesFId) : '';

        setInitialData(prevData => ({
            ...prevData,
            [`${type}AddressFID`]: addressId,
            StateName: stateName,
            CityName: cityName,
        }));

        setSelectedStateId(value ? value.StatesFId : null);
        setSelectedCityId(value ? value.CitiesFId : null);

        if (type === 'Invoice') {
            setInvoiceAddress(value);
        } else {
            setDeliveryAddress(value);
        }
    };


    const getStateName = (StatesFId: number) => {
        const state = stateListData.find(s => s.Id === StatesFId) || null;
        return state ? state.Name : '';
    };

    const getCityName = (CitiesFId: number) => {
        const city = listCityies.find(s => s.Id === CitiesFId) || null;
        return city ? city.Name : '';
    };

    const handleProductChange = (index: number, event: any) => {
        const { name, value } = event.target;
        const updatedProducts = initialData.Products.map((product, i) =>
            i === index ? { ...product, [name]: value } : product
        );

        setInitialData(prevData => ({ ...prevData, Products: updatedProducts }));

        if (name === 'ProductsFId') {
            const selectedProduct = productList.find(product => product.Id === Number(value));
            if (selectedProduct) {
                const updatedProductsWithCategory = updatedProducts.map((product, i) =>
                    i === index ? {
                        ...product,
                        ProductsCategoryFId: selectedProduct.ProductCategoryFId,
                        Description: selectedProduct.SaleDesc
                    } : product
                );
                setInitialData(prevData => ({ ...prevData, Products: updatedProductsWithCategory }));

                dispatch(getFilterTax({
                    ProductsCategoryFId: selectedProduct.ProductCategoryFId,
                    ProductsFId: selectedProduct.Id,
                    StateFId: selectedStateId,
                    CitiesFId: selectedCityId,
                    EffectiveDateTime: moment.utc(initialData.ExpectedDateTime),
                    Type: "SalesOrder",
                })).then((response) => {
                    const taxes = response.payload.message.data;
                    const updatedProductsWithTaxes = updatedProductsWithCategory.map((product, i) =>
                        i === index ? {
                            ...product,
                            TaxesDetails: taxes.map((tax: any) => ({
                                TaxName: tax.Name,
                                TaxRate: tax.Rate,
                                PA_Income_FId: tax.PA_Income_FId,
                                PA_Expense_FId: tax.PA_Expense_FId
                            }))
                        } : product
                    );

                    setInitialData({
                        ...initialData,
                        Products: updatedProductsWithTaxes,
                    });
                    setSalesDetails({
                        ...initialData,
                        [index]: taxes,
                    });


                    dispatch(filterSalesCost({
                        CustomersFId: initialData.CustomersFId,
                        PCFId: selectedProduct.ProductCategoryFId,
                        ProductsFId: selectedProduct.Id,
                        EffectiveDateTime: moment.utc(initialData.ExpectedDateTime),
                    })).then((secondResponse) => {
                        const cost = typeof secondResponse.payload.message.data === 'string'
                            ? parseFloat(secondResponse.payload.message.data)
                            : secondResponse.payload.message.data || 0;
                        if (cost === '0') {
                            toast.error('Price Rule doesnot exsist')
                        }
                        console.log("Unit Rate Response: ", cost);

                        const updatedProductsWithUnitRate = updatedProductsWithTaxes.map((product, i) =>
                            i === index ? {
                                ...product,
                                UnitRate: '', // Empty the UnitRate first
                            } : product
                        ).map((product, i) =>
                            i === index ? {
                                ...product,
                                UnitRate: cost, // Set the fetched unit rate
                            } : product
                        );


                        setInitialData((prevData) => {
                            const updatedData = {
                                ...prevData,
                                Products: updatedProductsWithUnitRate,
                            };
                            console.log("Updated Initial Data: ", updatedData); // Ensure UnitRate is set correctly
                            return updatedData;
                        });

                        dispatch(filterFreightRule({
                            CustomersFId: initialData.CustomersFId,
                            PCFId: selectedProduct.ProductCategoryFId,
                            ProductsFId: selectedProduct.Id,
                            EffectiveDateTime: moment.utc(initialData.ExpectedDateTime),
                        })).then((freightResponse: any) => {
                            const freight = freightResponse.payload.message.data || 0;
                            console.log("Freight Response: ", freight);

                            const updatedProductsWithFreight = updatedProductsWithUnitRate.map((product, i) =>
                                i === index ? {
                                    ...product,
                                    FreightAmount: freight, // Set the fetched freight
                                } : product
                            );

                            setInitialData({
                                ...initialData,
                                Products: updatedProductsWithFreight,
                            });
                            console.log("Updated Products with Freight: ", updatedProductsWithFreight);

                        }).catch(error => {
                            console.error("Error fetching freight: ", error);
                        });

                    }).catch(error => {
                        console.error("Error fetching unit rate: ", error);
                    });
                }).catch(error => {
                    console.error("Error fetching taxes: ", error);
                });
            }
        }

        if (name === "Basis") {
            if (value === "Gross") {
                updatedProducts[index].BilledQuantity = updatedProducts[index].GrossQuantity;
            } else if (value === "Net") {
                updatedProducts[index].BilledQuantity = updatedProducts[index].NetQuantity;
            }
        }

        // Ensure BilledQuantity is updated when GrossQuantity is updated
        if (name === "GrossQuantity") {
            updatedProducts[index].BilledQuantity = value; // Set BilledQuantity to the new GrossQuantity
        }

        // Update state with adjusted product data
        setInitialData({
            ...initialData,
            Products: updatedProducts,
        });


    };





    const addProduct = () => {
        setInitialData({
            ...initialData,
            Products: [
                ...initialData.Products,
                {
                    ProductsFId: 0,
                    GrossQuantity: 0,
                    Basis: '',
                    BilledQuantity: 0,
                    UnitRate: 0,
                    NetQuantity: 0,
                    Description: '',
                    FreightAmount: 0,
                    Amount: 0,
                    PurchaseDesc: '',
                    SaleDesc: '',
                    MeasurementUnit: '',
                    TaxAmount: 0,
                    TaxesDetails: [
                        {
                            TaxName: '',
                            TaxRate: 0,
                            TaxBilledQuantity: 0,
                            TaxAmount: 0,
                            PA_Income_FId: 0,
                            PA_Expense_FId: 0,
                        }
                    ],
                    Id: 0,
                },
            ],
        });
    };
    const handleAddCharge = () => {
        if (!formVisible) {
            setFormVisible(true); // Show the form if it's not already visible
        } else {
            setAdditionalCharges([...additionalCharges, { AdditionalChargeFId: 0, Price: 0, BilledQuantity: 0 }]);
        }
    };
    const handleAddCustomerAssest = () => {

        setInitialData({
            ...initialData,
            DeliveryInfos: [
                ...initialData.DeliveryInfos,
                {
                    CustomersAssetFId: 0,
                    ProductsFId: 0,
                    DeliveryQuantity: 0,
                    Rate: 0,
                    Status: ''
                }
            ]
        });


    };

    const handleChargeChange = (index: number, field: string, value: any) => {
        const updatedCharges = [...additionalCharges];
        updatedCharges[index] = {
            ...updatedCharges[index],
            [field]: value,
            Price: field === 'AdditionalChargeFId' ? additionalchargesList.find(item => item.Id === value)?.Price || 0 : updatedCharges[index].Price,

        };

        console.log('Updated Charges:', updatedCharges);
        setAdditionalCharges(updatedCharges);
    };


    const handleAssestChange = (index: number, event: any) => {
        const { name, value } = event.target;
        const updatedAssets = initialData.DeliveryInfos.map((customersAsset, i) =>
            i === index ? { ...customersAsset, [name]: value } : customersAsset
        );

        setInitialData(prevData => ({ ...prevData, DeliveryInfos: updatedAssets }));


    };

    // const handleAssestChange = (index: number, event: any) => {
    //     const { name, value } = event.target;

    //     // Update DeliveryInfos array
    //     const updatedAssets = initialData.DeliveryInfos.map((customersAsset, i) =>
    //         i === index ? { ...customersAsset, [name]: value } : customersAsset
    //     );

    //     // Filter products for the selected asset
    //     const selectedAsset = customerAssestList.find((item) => item.Id === value);
    //     const filteredProducts = selectedAsset ? selectedAsset.ProductFIds.map((id) => productList.find((product) => product.Id === id)) : [];

    //     setInitialData((prevData) => ({
    //         ...prevData,
    //         DeliveryInfos: updatedAssets.map((asset, i) => (i === index ? { ...asset, filteredProducts } : asset)),
    //     }));
    // };
    const validateFields = (customersAsset: any) => {
        // Check if CustomersAssetFId is selected but ProductsFId is not
        return !(customersAsset.CustomersAssetFId && !customersAsset.ProductsFId);
    };

    const calculateAmount = (index: any) => {
        const { BilledQuantity, Price } = additionalCharges[index] || 0;
        return BilledQuantity && Price ? BilledQuantity * Price : '';
    };

    const removeProduct = (index: number) => {
        setInitialData({
            ...initialData,
            Products: initialData.Products.filter((_, i) => i !== index),
        });
    };
    const removeAdditionalCharge = (index: number) => {
        const updatedCharges = additionalCharges.filter((_, i) => i !== index);
        setAdditionalCharges(updatedCharges);
    };
    const removecustomerAssest = (index: number) => {
        setInitialData({
            ...initialData,
            DeliveryInfos: initialData.DeliveryInfos.filter((_, i) => i !== index),
        });
    };



    const handleSubmit = async () => {
        try {
            const updatedProducts = initialData.Products.map((product, index) => {
                let Id = product.ProductsFId;
                let TaxAmount = 0;
                let TaxesDetails: any[] = [];
                let Amount = 0;
                const Basis = product.Basis === '' ? 'Gross' : product.Basis;
                if (salesDetails[index] && salesDetails[index].length > 0) {
                    TaxesDetails = salesDetails[index].map((tax: any) => {
                        const billedQuantity = product.BilledQuantity;
                        const amount = ((product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity)) || 0;
                        const taxAmount = ((tax.Rate * (product.BilledQuantity)));

                        return {
                            TaxName: tax.Name,
                            TaxRate: tax.Rate,
                            PA_Income_FId: tax.PA_Income_FId,
                            PA_Expense_FId: tax.PA_Expense_FId,
                            TaxBilledQuantity: billedQuantity,
                            TaxAmount: taxAmount
                        };
                    });

                    TaxAmount = TaxesDetails.reduce((total, tax) => total + tax.TaxAmount, 0);
                } else {
                    TaxesDetails = product.TaxesDetails?.map((taxDetail: any) => {
                        const billedQuantity = (product.BilledQuantity) || 0;
                        const taxRate = parseFloat(taxDetail.TaxRate) || 0;

                        const taxAmount = (billedQuantity * taxRate);

                        return {
                            ...taxDetail,
                            TaxBilledQuantity: taxDetail.TaxBilledQuantity || billedQuantity.toString(),
                            TaxAmount: taxAmount,
                        };
                    }) || [];

                    TaxAmount = TaxesDetails.reduce((total, tax) => total + parseFloat(tax.TaxAmount), 0);

                }
                Amount = ((product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity));
                return { ...product, TaxAmount, TaxesDetails, Amount, Id, Basis };
            });

            const totalTaxAmount = initialData.Products.reduce((total, product) => (
                total + product.TaxesDetails.reduce((taxTotal, tax) => (
                    taxTotal + (tax.TaxRate * product.BilledQuantity)
                ), ((product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity)) || 0)
            ), 0);


            const formattedOtherCharges = additionalCharges
                .filter(charge => charge.BilledQuantity > 0 || charge.Price > 0)
                .map(charge => {
                    const getName = () => {
                        const Additionalname = additionalchargesList.find(s => s.Id === charge.AdditionalChargeFId) || null;
                        return Additionalname ? Additionalname.Name : '';
                    };
                    return {
                        OtherChargesFId: charge.AdditionalChargeFId,
                        BilledQuantity: charge.BilledQuantity,
                        UnitRate: charge.Price,
                        Amount: calculateAmount(additionalCharges.indexOf(charge)),
                        OCName: getName() || null
                    };
                }) || 0;

            const isDefaultDeliveryInfo = (info: typeof salesOrderInitialValues["DeliveryInfos"][0]) => {
                return (
                    info.CustomersAssetFId === 0 &&
                    info.ProductsFId === 0 &&
                    info.DeliveryQuantity === 0 &&
                    info.Rate === 0 &&
                    info.Status === ''
                );
            };

            const filteredDeliveryInfos = initialData.DeliveryInfos.every(isDefaultDeliveryInfo)
                ? []
                : initialData.DeliveryInfos;

            const finalData = {
                ...initialData,
                Products: updatedProducts,
                OtherCharges: formattedOtherCharges || {},
                TotalAmt: totalTaxAmount,
                ExpectedDateTime: moment.utc(initialData.ExpectedDateTime),
                OrderDateTime: moment.utc(initialData.OrderDateTime),
                InvoiceDateTime: moment.utc(initialData.InvoiceDateTime),
                DeliveryInfos: filteredDeliveryInfos,
                InvoiceAddressFID: initialData.InvoiceAddressFID || null,
            };

            if (props.editData) {
                const action = await dispatch(updateSalesOrder({
                    sales_id: props.editData.Id,
                    ...finalData,
                }));
                setInitialData({ ...salesOrderInitialValues });
                const response = action.payload;
                props.setEditData(null);
                toast.success(response.message.message);
                props.toggleForm();
            } else {
                const action = await dispatch(addSalesOrder(finalData));
                const response = action.payload;
                setInitialData({ ...salesOrderInitialValues });
                if (response.message.code === "SUCCESS") {
                    toast.success(response.message.message);
                    props.toggleForm();
                }
                if (response.message.code === "FAILED") {
                    toast.error(response.message.message);
                    console.log(initialData)
                    setInitialData({ ...initialData });
                }

            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };


    const handleEditCustomer = () => {
        if (props.editData) {
            return customerList.find(item => item.Id === initialData.CustomersFId) || null;
        } else {
            return initialData.CustomersFId ? customerList.find(item => item.Id === initialData.CustomersFId) || null : null;
        }
    }

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setInitialData(prevData => ({
            ...prevData,
            [name]: checked
        }));
    };

    const handleCheckboxsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setInitialData(prevData => ({
            ...prevData,
            [name]: checked
        }));
    };

    const handleEditProduct = (index: number) => {
        // If editing data, return the appropriate product from the product list.
        if (props.editData && props.editData.Products.length > 0 && index < props.editData.Products.length) {
            return productList.find(item => item.Id === props.editData.Products[index].ProductsFId) || null;
        }
        // For new products, return null to ensure empty fields.
        return null;
    };

    const truncateText = (text: any, maxLength: any) => {
        if (text && typeof text === 'string' && text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text || '';
    }


    const handleRowToggle = (index: number) => {
        setOpenRows(openRows.includes(index) ? openRows.filter(i => i !== index) : [...openRows, index]);
    };

    return (
        <Box>
            <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
                <Box>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={customerList}
                                getOptionLabel={(option) => option.DisplayName}
                                value={handleEditCustomer()}
                                // onChange={(event, value) => handleChange({ target: { name: "CustomersFId", value: value ? value.Id : '' } })}
                                onChange={handleCustomerChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Customer name"
                                        variant="filled"
                                        size="small"
                                        onChange={handleChange}
                                        required
                                        value={initialData.CustomersFId}
                                        name="CustomersFId"
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props}>{option.DisplayName}</li>
                                )}
                                noOptionsText={
                                    <li
                                        style={{ cursor: 'pointer', padding: '4px 10px' }}
                                        onClick={() => window.location.href = '/customer'}
                                    >
                                        Create Customer
                                    </li>
                                }
                            />
                            <Autocomplete
                                options={invoiceAddressOptions}
                                getOptionLabel={(option) => {
                                    const stateName = getStateName(option.StatesFId);
                                    const cityName = getCityName(option.CitiesFId);
                                    return `${option.Line1}, ${stateName}, ${cityName}`;
                                }}
                                value={deliveryAddress}
                                onChange={handleAddressChange('Delivery')}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Delivery Address"
                                        variant="filled"
                                        required
                                        size="small"
                                        fullWidth
                                        style={{ marginTop: '9px' }}
                                    />
                                )}
                                renderOption={(props, option) => {
                                    const stateName = getStateName(option.StatesFId);
                                    const cityName = getCityName(option.CitiesFId);
                                    return (
                                        <li {...props}>
                                            {`${option.Line1}, ${stateName}, ${cityName}`}
                                        </li>
                                    );
                                }}
                            />

                            <Autocomplete
                                options={deliveryAddressOptions}
                                getOptionLabel={(option) => {
                                    const stateName = getStateName(option.StatesFId);
                                    const cityName = getCityName(option.CitiesFId);
                                    return `${option.Line1}, ${stateName}, ${cityName}`;
                                }}
                                value={invoiceAddress}
                                onChange={handleAddressChange('Invoice')}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Invoice Address"
                                        // required
                                        variant="filled"
                                        size="small"
                                        fullWidth
                                        style={{ marginTop: '9px' }}
                                    />
                                )}
                                renderOption={(props, option) => {
                                    const stateName = getStateName(option.StatesFId);
                                    const cityName = getCityName(option.CitiesFId);
                                    return (
                                        <li {...props}>
                                            {`${option.Line1}, ${stateName}, ${cityName}`}
                                        </li>
                                    );
                                }}
                            />

                            <TextValidator
                                fullWidth
                                select
                                label="SO Status"
                                onChange={handleChange}
                                name="SOStatus"
                                value={initialData.SOStatus}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                size="small"
                                variant="filled"
                                sx={textFieldStyles}
                            >
                                <MenuItem value="Opened">Opened</MenuItem>
                            </TextValidator>


                            {props.editData && (
                                <TextValidator
                                    fullWidth
                                    disabled
                                    label="DocNumber"
                                    onChange={handleChange}
                                    name="DocNumber"
                                    // value={initialData.DocNumber}
                                    value={`SO-${initialData.DocNumber}`}
                                    size="small"
                                    variant="filled"
                                    sx={textFieldStyles}
                                />
                            )}
                            <TextValidator
                                fullWidth
                                label="Delivered By"
                                onChange={handleChange}
                                name="DeliveredBy"
                                value={initialData.DeliveredBy}

                                required
                                // validators={['required']}
                                // errorMessages={['This field is required']}
                                size="small"
                                variant="filled"
                                style={{ marginTop: '9px' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextValidator
                                fullWidth
                                label="Order-Date-Time"
                                name="OrderDateTime"
                                value={initialData.OrderDateTime}
                                type="datetime-local"
                                size="small"
                                validators={['required']}
                                errorMessages={['This field is required']}
                                onChange={handleChange}
                                variant="filled"
                            // sx={textFieldStyles}
                            />
                            <TextValidator
                                fullWidth
                                label="Arrived-Date-Time"
                                name="ExpectedDateTime"
                                value={initialData.ExpectedDateTime}
                                type="datetime-local"
                                size="small"
                                validators={['required']}
                                errorMessages={['This field is required']}
                                onChange={handleChange}
                                variant="filled"
                                sx={textFieldStyles}
                            />
                            <TextValidator
                                fullWidth
                                label="Completed-Date-Time"
                                name="InvoiceDateTime"
                                value={initialData.InvoiceDateTime}
                                type="datetime-local"
                                size="small"
                                validators={['required']}
                                errorMessages={['This field is required']}
                                onChange={handleChange}
                                required
                                variant="filled"
                                sx={textFieldStyles}
                            />
                            <TextValidator
                                fullWidth
                                label="Truck"
                                onChange={handleChange}
                                name="Truck"
                                required
                                value={initialData.Truck}
                                // validators={['required']}
                                // errorMessages={['This field is required']}
                                size="small"
                                variant="filled"
                                style={{ marginTop: '9px' }}
                            />


                            {/* <TextValidator
                                fullWidth
                                label="Driver"
                                onChange={handleChange}
                                name="Driver"
                                value={initialData.Driver}
                                // validators={['required']}
                                // errorMessages={['This field is required']}
                                size="small"
                                variant="filled"
                                style={{ marginTop: '9px' }}
                            /> */}
                        </Grid>
                    </Grid>


                </Box >
                < Divider sx={{ my: 2 }} />

                <Box>

                    {/* product  table */}
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table" sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ background: '#EFEFEF' }}>

                                    <TableCell />
                                    <TableCell>Product</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Gross Quantity</TableCell>
                                    <TableCell>Net Quantity</TableCell>
                                    <TableCell>Basis</TableCell>
                                    <TableCell>Billed Quantity</TableCell>
                                    <TableCell>Unit Rate</TableCell>
                                    <TableCell>Freight Rate</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {initialData.Products.map((product, index) => (
                                    <React.Fragment key={index}>
                                        <TableRow>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => handleRowToggle(index)}
                                                >
                                                    {openRows.includes(index) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>
                                            </TableCell>
                                            {/* <TableCell sx={tableFormStyles}>
                                                <Autocomplete
                                                    fullWidth
                                                    options={productList}
                                                    getOptionLabel={(option) => option.Name}
                                                    value={handleEditProduct()}
                                                    onChange={(event, value) => {
                                                        handleProductChange(index, { target: { name: "ProductsFId", value: value ? value.Id : '' } });
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            name="ProductsFId"
                                                            sx={{ width: '130px' }}
                                                        />
                                                    )}
                                                />
                                            </TableCell> */}
                                            <TableCell sx={tableFormStyles}>
                                                <Autocomplete
                                                    fullWidth
                                                    options={productList}
                                                    getOptionLabel={(option) => option.Name}
                                                    value={
                                                        productList.find(
                                                            (item) => item.Id === initialData.Products[index].ProductsFId
                                                        ) || null
                                                    }
                                                    onChange={(event, value) => {
                                                        handleProductChange(index, {
                                                            target: { name: "ProductsFId", value: value ? value.Id : 0 },
                                                        });
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            name="ProductsFId"
                                                            required
                                                            sx={{ width: "130px" }}
                                                        />
                                                    )}
                                                />

                                            </TableCell>

                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    name="Description"
                                                    value={truncateText(product.Description, 20)}
                                                    // validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    size="small"
                                                    fullWidth
                                                    multiline
                                                    rows={1}
                                                    sx={{ width: '130px' }}
                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    name="GrossQuantity"
                                                    value={product.GrossQuantity}
                                                    validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    // type="number"
                                                    size="small"
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    fullWidth
                                                    name="NetQuantity"
                                                    // type="number"
                                                    value={product.NetQuantity}
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    select
                                                    name="Basis"
                                                    value={product.Basis || 'Gross'}
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    fullWidth
                                                    size="small"
                                                    sx={{ width: '85px' }}
                                                >
                                                    <MenuItem value="Net">Net</MenuItem>
                                                    <MenuItem value="Gross">Gross</MenuItem>
                                                </TextValidator>
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    name="BilledQuantity"
                                                    value={product.BilledQuantity}
                                                    validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    // type="number"
                                                    size="small"
                                                    required
                                                    fullWidth
                                                />
                                            </TableCell>

                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    fullWidth
                                                    name="UnitRate"
                                                    // type="number"
                                                    value={product.UnitRate ?? 0}
                                                    //value={typeof product.UnitRate === 'object' ? 0 : product.UnitRate || 0}
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    name="FreightAmount"
                                                    value={product.FreightAmount || '0'}
                                                    validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    // type="number"
                                                    size="small"
                                                    // label="Freight Rate"
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    fullWidth
                                                    name="Amount"
                                                    type="number"
                                                    value={(product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity) || 0}
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    size="small"
                                                    disabled
                                                />
                                            </TableCell>
                                            <TableCell sx={{ padding: '0px' }}>
                                                <Button variant="text" size="large" onClick={() => removeProduct(index)}>
                                                    <Tooltip title="Remove Product" arrow placement="top">
                                                        <RemoveCircle sx={{ color: 'darkred' }} />
                                                    </Tooltip>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={10} sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ whiteSpace: 'nowrap' }}>
                                                    <strong style={{ fontSize: '0.712rem' }}>Product Total(Tax Included) :</strong> &nbsp;
                                                    <span style={{ fontWeight: 'normal' }}>

                                                        {product.TaxesDetails.reduce((total, tax) => (
                                                            total + ((tax.TaxRate * (product.BilledQuantity)))
                                                        ), + ((product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity)) || 0)}
                                                    </span>
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/* {product.TaxesDetails && product.TaxesDetails.length > 0 && ( */}
                                        {product.TaxesDetails && (
                                            // console.log({ CCC: product.TaxesDetails }),
                                            <TableRow>
                                                <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} />
                                                <TableCell sx={{ padding: 0 }} colSpan={9}>
                                                    <Collapse in={openRows.includes(index)} timeout="auto" unmountOnExit>
                                                        <Box>
                                                            <Table size="small" aria-label="purchases">
                                                                <TableHead>
                                                                    <TableRow sx={{ background: '#EFEFEF' }}>
                                                                        <TableCell>Name</TableCell>
                                                                        <TableCell>Rate</TableCell>
                                                                        <TableCell>Tax Bill Quantity</TableCell>
                                                                        <TableCell>Tax Amount</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {product.TaxesDetails.map((item, taxIndex) => (
                                                                        <TableRow key={taxIndex}>
                                                                            <TableCell>{item.TaxName}</TableCell>
                                                                            <TableCell>{item.TaxRate}</TableCell>
                                                                            <TableCell>{product.BilledQuantity}</TableCell>
                                                                            <TableCell>{(item.TaxRate * (product.BilledQuantity))}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Add Product Button and Total Amount on the same line */}
                        <Box
                            sx={{
                                margin: '0.5rem 0.4rem',
                                color: '#f44336',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between', // Adjust spacing between items
                                fontSize: '0.71rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography onClick={addProduct} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: '1rem' }}>
                                    <AddCircle /> &nbsp; Add Product
                                </Typography>
                            </div>
                            <Typography
                                sx={{
                                    marginRight: "0.5rem",
                                    textAlign: "end",
                                    color: 'rgba(0, 0, 0, 0.87)',
                                }}
                            >
                                <strong style={{ fontSize: '0.712rem' }}>
                                    Total Amount:
                                </strong> &nbsp;
                                {/* <span style={{ fontWeight: 'normal' }}>
                                    {
                                        initialData.Products.reduce((totalAmount: number, product: any) => {
                                            if (product.TaxesDetails && product.TaxesDetails.length > 0) {
                                                // If more than one tax
                                                if (product.TaxesDetails.length > 1) {
                                                    return totalAmount + parseFloat(
                                                        product.TaxesDetails.reduce((total: number, tax: any) => {
                                                            if (tax.TaxRate === 0) {
                                                                return ((product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity));
                                                            }
                                                            return total + (((tax.TaxRate || 0) * (product.BilledQuantity)) + ((product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity)));
                                                        }, -((product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity)) || 0).toFixed(2)
                                                    );
                                                } else {
                                                    // If only one tax
                                                    return totalAmount + parseFloat(
                                                        product.TaxesDetails.reduce((total: number, tax: any) => {
                                                            if (tax.TaxRate === 0) {
                                                                return ((product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity));
                                                            }
                                                            return total + (((tax.TaxRate || 0) * (product.BilledQuantity)) + ((product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity)));
                                                        }, 0).toFixed(2)
                                                    );
                                                }
                                            }
                                            // If no taxes
                                            return totalAmount + ((product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity));
                                        }, 0).toFixed(2)
                                    }
                                </span> */}
                                <span style={{ fontWeight: 'normal' }}>
                                    {initialData.Products.reduce((total, product) => (
                                        total + product.TaxesDetails.reduce((taxTotal, tax) => (
                                            taxTotal + (tax.TaxRate * product.BilledQuantity)
                                        ), ((product.BilledQuantity * product.UnitRate) + (product.FreightAmount * product.BilledQuantity)) || 0)
                                    ), 0)}
                                </span>

                            </Typography>
                        </Box>
                    </TableContainer>


                    {/* Assest Table */}
                    <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
                        <Table size="small" aria-label="a dense table" sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ background: '#EFEFEF' }}>
                                    <TableCell>Asset Name</TableCell>

                                    <TableCell>UniqueId</TableCell>
                                    <TableCell>Product</TableCell>
                                    <TableCell>DeliveryQuantity</TableCell>
                                    <TableCell>Rate</TableCell>
                                    <TableCell>Status</TableCell>

                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {initialData.DeliveryInfos.map((customersAsset, index) => {
                                    const selectedAsset = customerAssestList.find(
                                        (item) => item.Id === customersAsset.CustomersAssetFId
                                    );

                                    return (
                                        <TableRow>
                                            <TableCell sx={tableFormStyles}>
                                                <Autocomplete
                                                    fullWidth
                                                    options={customerAssestList}
                                                    getOptionLabel={(option) => option.Name}
                                                    value={
                                                        customerAssestList.find(
                                                            (item) => item.Id === initialData.DeliveryInfos[index].CustomersAssetFId
                                                        ) || null
                                                    }

                                                    onChange={(event, value) => {
                                                        handleAssestChange(index, {
                                                            target: { name: "CustomersAssetFId", value: value ? value.Id : 0 },
                                                        });
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            name="CustomersAssetFId"
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    name="UniqueId"
                                                    value={selectedAsset ? selectedAsset.UniqueId : 'N/A'} // Display UniqueId
                                                    validators={['required']} // Add validation if necessary
                                                    errorMessages={['This field is required']} // Error message if validation fails
                                                    onChange={(e) => handleAssestChange(index, e)} // Handle changes if editable
                                                    fullWidth
                                                    disabled
                                                    size="small"
                                                    InputProps={{
                                                        readOnly: true, // Make this field readonly since it's derived from selected asset
                                                    }}
                                                />
                                            </TableCell>


                                            <TableCell sx={{ width: '300px', padding: '6px' }} >
                                                <Autocomplete

                                                    options={
                                                        customerAssestList.find((item) => item.Id === customersAsset.CustomersAssetFId)?.ProductFIds?.map(
                                                            (productId) => productList.find((product) => product.Id === productId)
                                                        )?.filter(Boolean) ?? [] // Ensure options is always an array
                                                    }
                                                    getOptionLabel={(option) => option?.Name || ''}
                                                    value={
                                                        productList.find((item) => item.Id === customersAsset.ProductsFId) || null
                                                    }
                                                    onChange={(event, value) => {
                                                        handleAssestChange(index, {
                                                            target: { name: "ProductsFId", value: value ? value.Id : 0 },
                                                        });
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            name="ProductsFId"
                                                            fullWidth
                                                            helperText={
                                                                !validateFields(customersAsset)
                                                                    ? "Product is required when an asset is selected."
                                                                    : ""
                                                            }
                                                        />
                                                    )}
                                                />


                                            </TableCell>




                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    name="DeliveryQuantity"
                                                    value={customersAsset.DeliveryQuantity}
                                                    onChange={(e) => handleAssestChange(index, e)}
                                                    type="number"
                                                    size="small"
                                                    fullWidth


                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    name="Rate"
                                                    value={customersAsset.Rate}
                                                    onChange={(e) => handleAssestChange(index, e)}
                                                    type="number"
                                                    size="small"
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    select
                                                    name="Status"
                                                    value={customersAsset.Status}
                                                    onChange={(e) => handleAssestChange(index, e)}
                                                    // validators={['required']}
                                                    // errorMessages={['This field is required']}
                                                    fullWidth
                                                    size="small"

                                                >
                                                    <MenuItem value="Delivered" >Delivered</MenuItem>
                                                    <MenuItem value="Not Delivered">Not Delivered</MenuItem>
                                                </TextValidator>
                                            </TableCell>
                                            <TableCell sx={{ padding: '0px' }}>
                                                <Button variant="text" size="large" onClick={() => removecustomerAssest(index)}>
                                                    <Tooltip title="Remove Customer Assests" arrow placement="top">
                                                        <RemoveCircle sx={{ color: 'darkred' }} />
                                                    </Tooltip>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <Box
                            sx={{
                                margin: '0.5rem 0.4rem',
                                color: '#f44336',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between', // Adjust spacing between items
                                fontSize: '0.71rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography onClick={handleAddCustomerAssest} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <AddCircle /> &nbsp; Add Assests
                                </Typography>
                            </div>
                        </Box>
                    </TableContainer>

                    {/* other charges table */}

                    <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
                        <Table size="small" aria-label="a dense table" sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ background: '#EFEFEF' }}>
                                    <TableCell>Other Charges</TableCell>
                                    {/* <TableCell>Other Charges Price</TableCell> */}
                                    {/* <TableCell>Income Account</TableCell>
                                    <TableCell>Expense Account</TableCell> */}
                                    {/* <TableCell>Description</TableCell>
                                    <TableCell>Gross Quantity</TableCell>
                                    <TableCell>Net Quantity</TableCell>
                                    <TableCell>Basis</TableCell> */}
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Unit Rate</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formVisible && additionalCharges.map((charge, index) => (
                                    <TableRow>
                                        <TableCell sx={tableFormStyles}>
                                            <Autocomplete
                                                options={additionalchargesList}
                                                getOptionLabel={(option) => option.Name}
                                                value={additionalchargesList.find(option => option.Id === additionalCharges[index]?.AdditionalChargeFId) || null}
                                                onChange={(e, value) => {
                                                    if (value) {
                                                        handleChargeChange(index, 'AdditionalChargeFId', value.Id);
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        // label="Additional Charge Name"
                                                        // variant="filled"
                                                        // size="small"
                                                        // sx={{ width: "190px" }}
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        {/* <TableCell sx={tableFormStyles}>
                                            <TextValidator
                                                disabled
                                                fullWidth
                                                // label="Additional Charge Price"
                                                name={`additionalChargeRate${index}`}
                                                type="number"
                                                size="small"
                                                // variant="filled"
                                                value={additionalCharges[index]?.Price || ''}
                                                onChange={(e) => handleChargeChange(index, 'Price', (e.target as HTMLInputElement).value)}
                                            />
                                        </TableCell> */}
                                        {/* <TableCell sx={tableFormStyles}>
                                            <TextValidator
                                                // onChange={(e) => handleProductChange(index, e)}
                                                name="Description"
                                                // value={truncateText(product.Description, 20)}
                                                value={""}
                                                size="small"
                                                fullWidth
                                                multiline
                                                rows={1}

                                            />
                                        </TableCell>
                                        <TableCell sx={tableFormStyles}>
                                            <TextValidator
                                                name="GrossQuantity"
                                                value={1}
                                                type="number"
                                                size="small"
                                                disabled
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell sx={tableFormStyles}>
                                            <TextValidator
                                                name="NetQuantity"
                                                value={1}
                                                type="number"
                                                disabled
                                                size="small"
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell sx={tableFormStyles}>
                                            <TextValidator
                                                select
                                                name="Basis"
                                                value={"Net"}
                                                disabled
                                                // onChange={(e) => handleProductChange(index, e)}
                                                // validators={['required']}
                                                // errorMessages={['This field is required']}
                                                fullWidth
                                                size="small"
                                            // sx={{ width: '85px' }}
                                            >
                                                <MenuItem value="Net" >Net</MenuItem>
                                                <MenuItem value="Gross">Gross</MenuItem>
                                            </TextValidator>
                                        </TableCell> */}
                                        <TableCell sx={tableFormStyles}>
                                            <TextValidator
                                                name="BilledQuantity"
                                                value={charge.BilledQuantity || 0}
                                                onChange={(e) =>
                                                    handleChargeChange(
                                                        index,
                                                        'BilledQuantity',
                                                        (e.target as HTMLInputElement).value
                                                    )
                                                }
                                                // type="number"
                                                size="small"
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell sx={tableFormStyles}>
                                            <TextValidator
                                                name="UnitRate"
                                                value={charge.Price}
                                                onChange={(e) =>
                                                    handleChargeChange(index,
                                                        'Price',
                                                        (e.target as HTMLInputElement).value)
                                                }
                                                // type="number"
                                                size="small"
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell sx={tableFormStyles}>
                                            <TextValidator
                                                disabled
                                                fullWidth
                                                name={`additionalChargeRate${index}`}
                                                type="number"
                                                size="small"
                                                value={calculateAmount(index)}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ padding: '0px' }}>
                                            <Button variant="text" size="large" onClick={() => removeAdditionalCharge(index)}>
                                                <Tooltip title="Remove Other Charges" arrow placement="top">
                                                    <RemoveCircle sx={{ color: 'darkred' }} />
                                                </Tooltip>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Box
                            sx={{
                                margin: '0.5rem 0.4rem',
                                color: '#f44336',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between', // Adjust spacing between items
                                fontSize: '0.71rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography onClick={handleAddCharge} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <AddCircle /> &nbsp; Add Other Charges
                                </Typography>
                            </div>
                        </Box>
                    </TableContainer>




                </Box >
                <Grid container justifyContent="flex-end" mt={2}>
                    <Button
                        type="submit"
                        name="Save"
                        variant='contained'
                        loading={salesOrderListLoading}
                        disabled={salesOrderListLoading}
                    />
                </Grid>

            </ValidatorForm >

        </Box >
    )
}

export default SalesOrderForm