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
import { addPurchaseOrder, listPurchaseOrder, updatePurchase } from 'store/slices/purchaseorder';
import { filterRealTimeCost } from 'store/slices/realtimecostSlice';
import { stateList } from 'store/slices/stateSlice';
import { getFilterTax } from 'store/slices/taxSlice';
import { listAllTerminal, listTerminal } from 'store/slices/terminalSlice';
import { listVendor } from 'store/slices/vendorSlice';
import { tableFormStyles, textFieldStyles } from './styles';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { DropShipDataType } from 'types/DropShipType';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { VendorDataType } from 'types/Vendor';

interface Props {
    editData?: any;
    setEditData?: any;
    productList: { Id: string; Name: string }[] | null;
    toggleForm: () => void;
    dropShipData?: DropShipDataType;

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
interface TaxDetail {
    TaxName: string;
    TaxRate: number;
    Id: number;
    PA_Income_FId: number;
    PA_Expense_FId: number;
}

const purchaseOrderInitialValues = {
    CarrierName: '',
    TruckName: '',
    DriverName: '',
    OrderDateTime: '',
    LoadDateTime: '',
    DeliveryDateTime: '',
    BOL: '',
    POStatus: '',
    VendorsFId: 0,
    TerminalsFId: 0,
    VendorsAddressFId: 0,
    TotalAmt: '',
    DocNumber: '',
    TerminalsAddressFId: 0,
    DSOFId: 0,
    Products: [
        {
            ProductsFId: 0,
            SOPBFId: 0,
            GrossQuantity: 0,
            Basis: '',
            BilledQuantity: 0,
            NetQuantity: 0,
            UnitRate: '',
            Amount: '',
            Description: '',
            TaxAmount: '',
            PurchaseDesc: '',
            SaleDesc: '',
            MeasurementUnit: '',
            TaxesDetails: [
                {
                    TaxName: '',
                    TaxRate: 0,
                    TaxProductVolume: 0,
                    TaxAmount: 0,
                    PA_Income_FId: 0,
                    PA_Expense_FId: 0
                }
            ],
            Id: 0,
        }
    ],
    Address:
    {
        Line1: '',
        Line2: '',
        Line3: '',
        Line4: '',
        Line5: '',
        CountrySubDivisionCode: '',
        Country: '',
        PostalCode: '',
        Lat: '',
        Long: '',
        Note: '',
        IsBill: false,
        IsShip: false,
        Zip: '',
        StatesFId: 0,
        CitiesFId: 0
    },


}

const PurchaseOrderForm = (props: Props) => {

    const dispatch = useAppDispatch();
    const [openRows, setOpenRows] = useState<number[]>([]);
    const [initialData, setInitialData] = useState<typeof purchaseOrderInitialValues>({
        ...purchaseOrderInitialValues,
        POStatus: 'Opened',
    });

    const [tabIndex, setTabIndex] = useState(0);
    const [selectedTaxID, setSelectedTaxID] = useState<string | null>(null);
    const handleTabChange = (event: any, newValue: any) => {
        setTabIndex(newValue);
    };
    const [isFieldVisible, setIsFieldVisible] = useState(false);
    const [vendorSelected, setVendorSelected] = useState<boolean>(false);
    const [terminalSelected, setTerminalSelected] = useState<boolean>(false);
    const [taxDetails, setTaxDetails] = useState<{ [key: number]: TaxDetail[] }>({});
    const [addressOptions, setAddressOptions] = useState<AddressType[]>([]);
    const [selectedVendor, setSelectedVendor] = useState<VendorDataType | null>(null);
    const [taxRate, setTaxRate] = useState<any>([]);
    const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [vendorAddress, setVendorAddress] = useState<AddressType | null>(null);
    const [terminalAddress, setTerminalAddress] = useState('');

    useEffect(() => {
        if (props.editData) {
            setInitialData(props.editData);
        }
    }, [props.editData]);

    useEffect(() => {
        dispatch(listVendor());
        dispatch(listAllTerminal());
        dispatch(listProduct());
        dispatch(listPurchaseOrder());
        dispatch(stateList());
        dispatch(listCity());


    }, []);

    useEffect(() => {
        if (props.dropShipData) {
            setInitialData({
                ...props.editData,
                DeliveryDateTime: moment.utc(props.dropShipData.DeliveryDateTime).format('YYYY-MM-DD HH:mm:ss'),
                LoadDateTime: moment.utc(props.dropShipData.LoadDateTime).format('YYYY-MM-DD HH:mm:ss'),
                OrderDateTime: moment.utc(props.dropShipData.OrderDateTime).format('YYYY-MM-DD HH:mm:ss'),
            });

        }
        if (props.editData) {
            setInitialData({
                ...props.editData,
                DeliveryDateTime: moment.utc(props.editData.DeliveryDateTime).format('YYYY-MM-DD HH:mm:ss'),
                LoadDateTime: moment.utc(props.editData.LoadDateTime).format('YYYY-MM-DD HH:mm:ss'),
                OrderDateTime: moment.utc(props.editData.OrderDateTime).format('YYYY-MM-DD HH:mm:ss'),
            });

        }

    }, [props.editData]);


    const [vendorList, listVendorLoading] = useAppSelector(
        (state) => [
            state.vendorReducers.vendorList,
            state.vendorReducers.listVendorLoading
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


    const [productList, listProductLoading] = useAppSelector(
        (state) => [
            state.productReducers.productList,
            state.productReducers.listProductLoading
        ],
        shallowEqual
    );

    const [purchaseOrderList, purchaseOrderListLoading] = useAppSelector(
        (state) => [
            state.purchaseOrderReducers.purchaseOrderList,
            state.purchaseOrderReducers.purchaseOrderListLoading,
        ],
        shallowEqual
    );

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        if (name === 'ProductsFId' || name === 'ProductVolume' || name === 'UnitRate') {
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

        if (name === 'VendorsFId') {
            // dispatch(listTerminal(value));
            setVendorSelected(true);
        }
        if (name === 'TerminalsFId') {
            setTerminalSelected(true);
        }
    }


    const handleVendorChange = (event: any, value: VendorDataType | null) => {
        const vendorId = value ? value.Id : 0;
        const addresses = value ? value.Address : [];
        setSelectedVendor(value);
        setAddressOptions(addresses);

        setInitialData(prevData => ({
            ...prevData,
            VendorsFId: vendorId,
            VendorsAddressFId: addresses.length === 1 ? addresses[0].Id : 0,
            StateName: addresses.length === 1 ? getStateName(addresses[0].StatesFId) : '',
            CityName: addresses.length === 1 ? getCityName(addresses[0].CitiesFId) : '',
        }));

        const addressId = value ? value.Id : 0;
        const stateName = value ? getStateName(addresses[0].StatesFId) : 0;
        const cityName = value ? getCityName(addresses[0].CitiesFId) : '';

        setInitialData(prevData => ({
            ...prevData,
            VendorsAddressFId: addressId,
            StateName: stateName,
            CityName: cityName,
        }));
        console.log("value", stateName);

        setSelectedStateId(value ? addresses[0].StatesFId : null);
        setSelectedCityId(value ? addresses[0].CitiesFId : null);
    };

    useEffect(() => {
        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 16);
        setInitialData(prevState => ({
            ...prevState,
            DeliveryDateTime: formattedDateTime,
            LoadDateTime: formattedDateTime,
            OrderDateTime: formattedDateTime,
        }));
    }, []);
    useEffect(() => {
        if (props.editData) {
            const updatedProducts = props.editData.Products?.map((product: any, index: number) => {
                const updatedProduct: any = {
                    ...product,
                    ProductsFId: product.ProductsFId.toString(),
                    TaxesDetails: product.TaxesDetails.map((tax: any) => ({
                        TaxName: tax.TaxName,
                        TaxRate: tax.TaxRate,
                        TaxBilledQuantity: tax.TaxBilledQuantity,
                        TaxAmount: tax.TaxAmount
                    }))
                };

                0
                if ('ProductsCategoryFId' in product) {
                    updatedProduct.ProductsCategoryFId = product.ProductsCategoryFId;
                } else {
                    updatedProduct.ProductsCategoryFId = 0;
                }


                return updatedProduct;
            }) || [];

            setInitialData(prevState => ({
                ...prevState,
                Products: updatedProducts,
            }));


        }
    }, [props.editData]);


    const getStateName = (StatesFId: number) => {
        const state = stateListData.find(s => s.Id === StatesFId) || null;
        return state ? state.Name : '';
    };

    const getCityName = (CitiesFId: number) => {
        const city = listCityies.find(s => s.Id === CitiesFId) || null;
        return city ? city.Name : '';
    };

    useEffect(() => {
        const calculateAmount = (index: number) => {
            const product = initialData.Products[index];
            const unitRate = parseFloat(product.UnitRate);
            const billedquantity = (product.BilledQuantity);
            if (!isNaN(unitRate) && !isNaN(billedquantity)) {
                const amount = unitRate * billedquantity;
                const updatedProducts = [...initialData.Products];
                updatedProducts[index] = { ...product, Amount: amount.toFixed(2) };
                setInitialData({ ...initialData, Products: updatedProducts });
            }
        };


        initialData.Products.forEach((_, index) => {
            calculateAmount(index);
        });
    }, [initialData.Products]);

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
                        Description: selectedProduct.PurchaseDesc

                    } : product
                );
                setInitialData(prevData => ({ ...prevData, Products: updatedProductsWithCategory }));

                dispatch(getFilterTax({
                    ProductsCategoryFId: selectedProduct.ProductCategoryFId,
                    ProductsFId: selectedProduct.Id,
                    StateFId: selectedStateId,
                    CitiesFId: selectedCityId,
                    EffectiveDateTime: initialData.DeliveryDateTime,
                    Type: "PurchaseOrders",
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

                    setInitialData(prevState => ({
                        ...prevState,
                        Products: updatedProductsWithTaxes,
                    }));
                    setTaxDetails(prevState => ({
                        ...prevState,
                        [index]: taxes,
                    }));

                    dispatch(filterRealTimeCost({
                        VendorsFId: initialData.VendorsFId,
                        TerminalsFId: initialData.TerminalsFId,
                        ProductsFId: selectedProduct.Id,
                        EffectiveDateTime: initialData.DeliveryDateTime,
                    })).then((secondResponse) => {
                        const unitRate = secondResponse.payload.message.data.Cost;
                        const updatedProductsWithUnitRate = updatedProductsWithTaxes.map((product, i) =>
                            i === index ? {
                                ...product,
                                UnitRate: unitRate || 0,
                            } : product
                        );

                        setInitialData(prevState => ({
                            ...prevState,
                            Products: updatedProductsWithUnitRate,
                        }));
                    });
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
        if (name === "NetQuantity") {
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
                    SOPBFId: 0,
                    GrossQuantity: 0,
                    Basis: '',
                    BilledQuantity: 0,
                    NetQuantity: 0,
                    UnitRate: '',
                    Amount: '',
                    Description: '',
                    TaxAmount: '',
                    PurchaseDesc: '',
                    SaleDesc: '',
                    MeasurementUnit: '',

                    TaxesDetails: [
                        {
                            TaxName: '',
                            TaxRate: 0,
                            TaxProductVolume: 0,
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

    const removeProduct = (index: number) => {
        setInitialData({
            ...initialData,
            Products: initialData.Products.filter((_, i) => i !== index),
        });
    };

    useEffect(() => {
        if (props.editData) {
            const { VendorsFId, VendorsAddressFId, TerminalsFId } = props.editData;

            const selectedVendor = vendorList.find(v => v.Id === VendorsFId) || null;
            handleVendorChange(null, selectedVendor);

            if (VendorsAddressFId) {
                const selectedAddress = addressOptions.find(addr => addr.Id === VendorsAddressFId) || null;
                handleAddressChange(null, selectedAddress);
            }

            if (TerminalsFId) {
                const selectedTerminal = terminalList.find(term => term.Id === TerminalsFId) || null;
                setTerminalAddress(selectedTerminal ? selectedTerminal.Address : '');
            }
        }
    }, [props.editData, vendorList, addressOptions, terminalList]);


    const handleAddressChange = (event: any, value: AddressType | null) => {
        const addressId = value ? value.Id : 0;
        const stateName = value ? getStateName(value.StatesFId) : '';
        const cityName = value ? getCityName(value.CitiesFId) : '';

        setInitialData(prevData => ({
            ...prevData,
            VendorsAddressFId: addressId,
            StateName: stateName,
            CityName: cityName,
        }));
        console.log("value", stateName);

        setSelectedStateId(value ? value.StatesFId : null);
        setSelectedCityId(value ? value.CitiesFId : null);

        setVendorAddress(value);
    };





    useEffect(() => {

        console.log("dropShipData", props.dropShipData)
        if (props.dropShipData) {
            const { VendorsFId, BOL, TerminalsFId, OrderDateTime, LoadDateTime, DeliveryDateTime, VendorsAddressFId, SODetails } = props.dropShipData;

            type ProductDetail = typeof SODetails[0];

            // Group products by ProductsFId and Basis
            const groupedProducts = SODetails.reduce((acc: { [key: string]: ProductDetail }, detail) => {
                const key = `${detail.ProductsFId}_${detail.Basis}`;
                if (!acc[key]) {
                    acc[key] = { ...detail };
                } else {
                    acc[key].BilledQuantity += detail.BilledQuantity;
                    acc[key].GrossQuantity += detail.GrossQuantity;
                    acc[key].NetQuantity += detail.NetQuantity;
                    acc[key].UnitRate += detail.UnitRate;
                    acc[key].Amount = (parseFloat(acc[key].Amount) + parseFloat(detail.Amount)).toFixed(2);
                }
                return acc;
            }, {});

            console.log("acc", groupedProducts);

            // Convert the grouped products object back to an array
            // Convert the grouped products object back to an array
            const combinedProducts = Object.values(groupedProducts);

            const dropShipDataWithDSOFId = props.dropShipData as typeof props.dropShipData & { DSOFId?: number };


            const updatedInitialData = {
                ...initialData,
                POStatus: 'Opened',
                VendorsFId,
                DSOFId: dropShipDataWithDSOFId.DSOFId ?? 0,
                BOL,
                TerminalsFId,
                CarrierName: props.dropShipData.CarrierName,
                TruckName: props.dropShipData.TruckName,
                DriverName: props.dropShipData.DriverName,
                OrderDateTime: moment.utc(OrderDateTime).format('YYYY-MM-DD HH:mm:ss'),
                LoadDateTime: moment.utc(LoadDateTime).format('YYYY-MM-DD HH:mm:ss'),
                DeliveryDateTime: moment.utc(DeliveryDateTime).format('YYYY-MM-DD HH:mm:ss'),
                VendorsAddressFId: VendorsAddressFId || 0,
                Products: combinedProducts.map((detail, index) => {
                    const selectedProduct = productList.find(product => product.Id === detail.ProductsFId);
                    console.log("ProductsFId: detail.ProductsFId,", detail.ProductsFId,);
                    return {
                        SOPBFId: detail.Id,
                        ProductsFId: detail.ProductsFId,
                        UnitRate: '', // Set after fetching rates
                        Amount: String(detail.Amount),
                        Basis: detail.Basis,
                        PurchaseDesc: selectedProduct ? selectedProduct.PurchaseDesc : '',
                        MeasurementUnit: '',
                        SaleDesc: selectedProduct ? selectedProduct.SaleDesc : '',
                        BilledQuantity: detail.NetQuantity,
                        Description: selectedProduct ? selectedProduct.PurchaseDesc : '',
                        GrossQuantity: detail.GrossQuantity,
                        NetQuantity: detail.NetQuantity,
                        TaxAmount: '0',
                        TaxesDetails: [],
                        Id: detail.Id,


                    };
                }),
            };



            console.log("Updated Initial Data", updatedInitialData);

            const selectedVendor = vendorList.find(v => v.Id === VendorsFId) || null;
            handleVendorChange(null, selectedVendor);

            if (VendorsAddressFId) {
                const selectedAddress = addressOptions.find(addr => addr.Id === VendorsAddressFId) || null;
                handleAddressChange(null, selectedAddress);
            }

            if (TerminalsFId) {
                const selectedTerminal = terminalList.find(term => term.Id === TerminalsFId) || null;
                setTerminalAddress(selectedTerminal ? selectedTerminal.Address : '');
            }

            // Set initial data
            setInitialData(updatedInitialData);

            const promises = combinedProducts.map((detail, index) => {
                const selectedProduct = productList.find(product => product.Id === detail.ProductsFId);

                if (selectedProduct) {
                    return dispatch(getFilterTax({
                        ProductsCategoryFId: selectedProduct.ProductCategoryFId,
                        ProductsFId: selectedProduct.Id,
                        StateFId: selectedStateId,
                        CitiesFId: selectedCityId,
                        EffectiveDateTime: updatedInitialData.DeliveryDateTime,
                        Type: "PurchaseOrders",
                    })).then((response) => {
                        const taxes = response.payload.message.data;

                        updatedInitialData.Products[index].TaxesDetails = taxes.map((tax: any) => ({
                            TaxName: tax.Name,
                            TaxRate: tax.Rate,
                            PA_Income_FId: tax.PA_Income_FId,
                            PA_Expense_FId: tax.PA_Expense_FId,
                            TaxProductVolume: detail.BilledQuantity || 0,
                            TaxAmount: ((tax.Rate * detail.BilledQuantity) + parseFloat(detail.Amount) || 0).toFixed(2),
                        }));

                        return dispatch(filterRealTimeCost({
                            VendorsFId: updatedInitialData.VendorsFId,
                            TerminalsFId: updatedInitialData.TerminalsFId,
                            ProductsFId: selectedProduct.Id,
                            EffectiveDateTime: updatedInitialData.DeliveryDateTime,
                        })).then((secondResponse) => {
                            const unitRate = secondResponse.payload.message.data.Cost || '0';
                            updatedInitialData.Products[index].UnitRate = unitRate;
                        });
                    });
                }
            });

            Promise.all(promises).then(() => {
                setInitialData(updatedInitialData);
                console.log("initialData after taxes and rates", updatedInitialData);
            });
        }
    }, [props.dropShipData, vendorList, addressOptions, productList]);

    // Ensure vendors is included if used within useEffect
    useEffect(() => {
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

    const handleSubmit = async () => {
        try {
            const updatedProducts = initialData.Products.map((product, index) => {
                let Id = 0;
                let TaxAmount = 0;
                let TaxesDetails: any[] = [];

                if (taxDetails[index]) {
                    TaxesDetails = taxDetails[index].map((tax: any) => ({
                        TaxName: tax.Name,
                        TaxRate: tax.Rate,
                        PA_Income_FId: tax.PA_Income_FId,
                        PA_Expense_FId: tax.PA_Expense_FId,
                        TaxProductVolume: (product.BilledQuantity) || 0,
                        TaxAmount: ((tax.Rate * ((product.BilledQuantity)) + parseFloat(product.Amount) || 0)).toFixed(2)
                    }));
                    TaxAmount = parseFloat(TaxesDetails.reduce((total, tax) => total + parseFloat(tax.TaxAmount), 0));
                } else {

                    TaxesDetails = product.TaxesDetails || [];
                    TaxAmount = parseFloat(product.TaxAmount) || 0;
                    Id = product.ProductsFId || 0;
                }

                return { ...product, TaxAmount, TaxesDetails };
            });

            // const totalTaxAmount = updatedProducts.reduce((total, product) => {
            //     if (product.TaxesDetails && product.TaxesDetails.length > 0) {
            //         const productTotal = parseFloat(product.TaxesDetails.reduce((productTotal, tax) => {
            //             if (tax.TaxRate === 0) {
            //                 return parseFloat(product.Amount);
            //             }
            //             return productTotal + (((tax.TaxRate || 0) * (product.BilledQuantity)) + parseFloat(product.Amount));
            //         }, 0).toFixed(2));
            //         return total + productTotal;
            //     }
            //     return total + parseFloat(product.Amount);
            // }, 0);

            const totalTaxAmount = initialData.Products.reduce((total, product) => (
                total + product.TaxesDetails.reduce((taxTotal, tax) => (
                    taxTotal + (tax.TaxRate * product.BilledQuantity)
                ), ((product.BilledQuantity * parseFloat(product.UnitRate))) || 0)
            ), 0).toFixed(2);

            const finalData = {
                ...initialData,
                Products: updatedProducts,
                TotalAmt: totalTaxAmount,
                DeliveryDateTime: moment.utc(initialData.DeliveryDateTime),
                OrderDateTime: moment.utc(initialData.OrderDateTime),
                LoadDateTime: moment.utc(initialData.LoadDateTime)
            };

            if (props.editData) {
                const action = await dispatch(updatePurchase({
                    purchase_id: props.editData.Id,
                    ...finalData,
                }));
                setInitialData({ ...purchaseOrderInitialValues });
                const response = action.payload;
                props.setEditData(null);
                if (response.message.code === "SUCCESS") {
                    toast.success(response.message.message);
                }
                if (response.message.code === "FAILED") {
                    toast.error(response.message.message);
                }
                props.toggleForm();
            } else {
                const action = await dispatch(addPurchaseOrder(finalData));
                const response = action.payload;
                setInitialData({ ...purchaseOrderInitialValues });
                if (response.message.code === "SUCCESS") {
                    toast.success(response.message.message);
                }
                if (response.message.code === "FAILED") {
                    toast.error(response.message.message);
                }
                props.toggleForm();
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };


    const truncateText = (text: any, maxLength: any) => {
        if (typeof text === 'string' && text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text || ''; // Return an empty string if text is undefined or null
    };



    const handleRowToggle = (index: number) => {
        setOpenRows(openRows.includes(index) ? openRows.filter(i => i !== index) : [...openRows, index]);
    };

    const handleEditVendor = () => {
        if (props.editData) {
            return vendorList.find(item => item.Id === initialData.VendorsFId) || null;
        } else {
            return initialData.VendorsFId ? vendorList.find(item => item.Id === initialData.VendorsFId) || null : null;
        }
    }

    const handleEditTerminal = () => {

        if (props.editData) {

            return terminalList.find(item => item.Id === initialData.TerminalsFId) || null;

        } else {
            const selectedTerminal = terminalList.find(terminal => terminal.Id === initialData.TerminalsFId);
            return selectedTerminal || null;
        }
    }






    // const handleEditState = () => {
    //     if (props.editData) {
    //         return stateListData.find(item => item.Id === initialData.Address.StatesFId) || null;
    //     } else {
    //         return initialData.Address.StatesFId ? stateListData.find(item => item.Id === initialData.Address.StatesFId) || null : null;
    //     }
    // }

    // const handleEditCity = () => {
    //     if (props.editData) {
    //         return listCityies.find(item => item.Id === initialData.Address.CitiesFId) || null;
    //     } else {
    //         return initialData.Address.CitiesFId ? listCityies.find(item => item.Id === initialData.Address.CitiesFId) || null : null;
    //     }
    // }

    const handleEditProduct = (productId: any) => {
        if (props.editData && props.editData.Products.length > 0) {
            return productList.find(item => item.Id === props.editData.Products[0].ProductsFId) || null;
        }
        else {
            return productList.find(item => item.Id === productId) || null;
        }
    };


    return (
        <Box>
            <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
                <Box>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={vendorList}
                                getOptionLabel={(option) => option.DisplayName}
                                value={handleEditVendor()}
                                onChange={handleVendorChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Supplier name"
                                        variant="filled"
                                        size="small"
                                        onChange={handleChange}
                                        value={initialData.VendorsFId}
                                        name="VendorsFId"
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props}>{option.DisplayName}</li>
                                )}
                                noOptionsText={
                                    <li
                                        style={{ cursor: 'pointer', padding: '4px 10px' }}
                                        onClick={() => window.location.href = '/vendor'}
                                    >
                                        Create Suplier
                                    </li>
                                }
                            />
                            <Autocomplete
                                options={addressOptions}
                                getOptionLabel={(option) => {
                                    const stateName = getStateName(option.StatesFId);
                                    const cityName = getCityName(option.CitiesFId);
                                    return `${option.Line1}, ${stateName}, ${cityName}`;
                                }}
                                value={vendorAddress}
                                onChange={handleAddressChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Supplier Address"
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

                            {/* <Autocomplete
                                options={addressOptions}
                                getOptionLabel={(option) => {
                                    const stateName = getStateName(option.StatesFId);
                                    const cityName = getCityName(option.CitiesFId);
                                    return `${option.Line1}, ${stateName}, ${cityName}`;
                                }}
                                value={addressOptions.find(addr => addr.Id === initialData.VendorsAddressFId) || null}
                                onChange={handleAddressChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Supplier Address"
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
                            /> */}


                            <Autocomplete
                                options={terminalList}
                                getOptionLabel={(option) => `${option.Name} (${option.Number})`}
                                value={handleEditTerminal()}
                                filterOptions={(options, { inputValue }) => {
                                    const lowerCaseInput = inputValue.toLowerCase();
                                    const filtered = options.filter(
                                        (option) =>
                                            option.Name.toLowerCase().startsWith(lowerCaseInput) ||
                                            option.Number.toLowerCase().startsWith(lowerCaseInput)
                                    );
                                    return filtered;
                                }}

                                onChange={(event, value) => {
                                    // Update TerminalsFId and address state
                                    handleChange({ target: { name: "TerminalsFId", value: value ? value.Id : '' } });
                                    setTerminalAddress(value ? `${value.Address}` : '');
                                }}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label="Terminal name"
                                    variant="filled"
                                    size="small"
                                    required
                                    onChange={handleChange}
                                    value={initialData.TerminalsFId}
                                    name="TerminalsFId" />
                                }
                                style={{ marginTop: '9px' }}
                            />

                            <TextValidator
                                fullWidth
                                label="Terminal Address"
                                name="Terminal Address"
                                value={terminalAddress}
                                variant="filled"
                                size="small"
                                style={{ marginTop: '9px' }}
                                InputProps={{
                                    readOnly: true, // Make the address field read-only
                                }}
                            />


                            {props.editData && (
                                <TextValidator
                                    fullWidth
                                    disabled
                                    label="DocNumber"
                                    onChange={handleChange}
                                    name="DocNumber"
                                    // value={initialData.DocNumber}
                                    value={`PO-${initialData.DocNumber}`}
                                    size="small"
                                    variant="filled"
                                    style={{ marginTop: '9px' }}
                                // sx={textFieldStyles}
                                />
                            )}
                            <TextValidator
                                fullWidth
                                select
                                label="POStatus"
                                onChange={handleChange}
                                name="POStatus"
                                value={initialData.POStatus}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                size="small"
                                variant="filled"
                                style={{ marginTop: '9px' }}
                            >
                                <MenuItem value="Opened">Opened</MenuItem>
                            </TextValidator>
                            <TextValidator
                                fullWidth
                                label="BOL"
                                onChange={handleChange}
                                name="BOL"
                                value={initialData.BOL}
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
                                label="Delivery Date Time"
                                name="DeliveryDateTime"
                                value={initialData.DeliveryDateTime}
                                type="datetime-local"
                                size="small"
                                validators={['required']}
                                errorMessages={['This field is required']}
                                onChange={handleChange}
                                variant="filled"
                            />
                            <TextValidator
                                fullWidth
                                label="Load Date Time"
                                name="LoadDateTime"
                                value={initialData.LoadDateTime}
                                type="datetime-local"
                                size="small"
                                // validators={['required']}
                                // errorMessages={['This field is required']}
                                onChange={handleChange}
                                variant="filled"
                                style={{ marginTop: '9px' }}
                            />
                            <TextValidator
                                fullWidth
                                label="Order Date Time"
                                name="OrderDateTime"
                                value={initialData.OrderDateTime}
                                type="datetime-local"
                                size="small"
                                // validators={['required']}
                                // errorMessages={['This field is required']}

                                onChange={handleChange}
                                variant="filled"
                                style={{ marginTop: '9px' }}
                            />

                            <TextValidator
                                fullWidth
                                label="Carrier"
                                onChange={handleChange}
                                name="CarrierName"
                                value={initialData.CarrierName}
                                // validators={['required']}
                                // errorMessages={['This field is required']}
                                size="small"
                                variant="filled"
                                style={{ marginTop: '9px' }}
                            />

                            <TextValidator
                                fullWidth
                                label="Truck"
                                onChange={handleChange}
                                name="TruckName"
                                value={initialData.TruckName}
                                // validators={['required']}
                                // errorMessages={['This field is required']}
                                size="small"
                                variant="filled"
                                style={{ marginTop: '9px' }}
                            />

                            <TextValidator
                                fullWidth
                                label="Driver"
                                onChange={handleChange}
                                name="DriverName"
                                value={initialData.DriverName}
                                // validators={['required']}
                                // errorMessages={['This field is required']}
                                size="small"
                                variant="filled"
                                style={{ marginTop: '9px' }}
                            />
                            {/* <TextValidator
                                fullWidth
                                label="Description"
                                onChange={handleChange}
                                name="Description"
                                value={initialData.DriverName}
                                // validators={['required']}
                                // errorMessages={['This field is required']}
                                size="small"
                                variant="filled"
                                style={{ marginTop: '9px' }}
                            /> */}


                        </Grid>

                    </Grid>
                    {/* < Divider sx={{ my: 2 }} /> */}
                    {/* <Grid container spacing={2} mt={1}>
                        <Grid item xs={3} sm={6}>
                            <Autocomplete
                                fullWidth
                                options={stateListData}
                                getOptionLabel={(option) => option.Name}
                                value={handleEditState()}
                                onChange={(event, value) => handleAddressChange({ target: { name: "StatesFId", value: value ? value.Id : '' } })}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label="State"
                                    variant="filled"
                                    size="small"
                                    onChange={handleAddressChange}
                                    value={initialData.Address.StatesFId}
                                    name="StatesFId" />
                                }
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <Autocomplete
                                fullWidth
                                options={listCityies}
                                getOptionLabel={(option) => option.Name}
                                value={handleEditCity()}
                                onChange={(event, value) => handleAddressChange({ target: { name: "CitiesFId", value: value ? value.Id : '' } })}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label="City"
                                    variant="filled"
                                    size="small"
                                    onChange={handleAddressChange}
                                    value={initialData.Address.CitiesFId}
                                    name="CitiesFId" />
                                }
                            />

                        </Grid>
                    </Grid> */}

                </Box >
                < Divider sx={{ my: 2 }} />
                <Box>

                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table" sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ background: '#EFEFEF' }}>
                                    {/* {initialData.Products.some(product => product.TaxesDetails && product.TaxesDetails.length > 0) && <TableCell />} */}
                                    <TableCell />
                                    <TableCell>Product</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Gross Quantity</TableCell>
                                    <TableCell>Net Quantity</TableCell>
                                    <TableCell>Basis</TableCell>
                                    <TableCell>Billed Quantity</TableCell>
                                    <TableCell>Unit Rate</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {initialData.Products.map((product, index) => (
                                    <React.Fragment key={index}>
                                        <TableRow>
                                            {/* {product.TaxesDetails && product.TaxesDetails.length > 0 && ( */}
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => handleRowToggle(index)}
                                                >
                                                    {openRows.includes(index) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>
                                            </TableCell>
                                            {/* )} */}
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
                                                            sx={{ width: "130px" }}
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    name="Description"
                                                    disabled
                                                    value={truncateText(product.Description, 20)}
                                                    // validators={['required']}
                                                    // errorMessages={['This field is required']}
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
                                                    sx={{ width: '65px' }}
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
                                                    sx={{ width: '65px' }}
                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    select
                                                    name="Basis"
                                                    value={product.Basis || 'Net'}
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    // fullWidth
                                                    size="small"
                                                    sx={{ width: '65px' }}
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
                                                    fullWidth
                                                    sx={{ width: '65px' }}
                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    fullWidth
                                                    name="UnitRate"
                                                    // type="number"
                                                    value={product.UnitRate}
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    size="small"
                                                    sx={{ width: '100px' }}
                                                />
                                            </TableCell>
                                            <TableCell sx={tableFormStyles}>
                                                <TextValidator
                                                    fullWidth
                                                    name="Amount"
                                                    // type="number"
                                                    value={product.Amount}
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
                                                        ), + parseFloat(product.Amount) || 0).toFixed(2)}
                                                    </span>
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/* {product.TaxesDetails && product.TaxesDetails.length > 0 && ( */}
                                        {product.TaxesDetails && (

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
                                                                            <TableCell>{(item.TaxRate * (product.BilledQuantity)).toFixed(2)}</TableCell>
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
                                color: '#1976d2',
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
                                                return totalAmount + parseFloat(
                                                    product.TaxesDetails.reduce((total: number, tax: any) => {
                                                        if (tax.Rate === 0) {
                                                            return parseFloat(product.Amount);
                                                        }
                                                        return total + (((tax.TaxRate || 0) * (product.BilledQuantity)) + parseFloat(product.Amount));
                                                    }, 0).toFixed(2)
                                                );
                                            }
                                            return totalAmount + parseFloat(product.Amount);
                                        }, 0).toFixed(2)
                                    }
                                </span> */}

                                <span style={{ fontWeight: 'normal' }}>
                                    {initialData.Products.reduce((total, product) => (
                                        total + product.TaxesDetails.reduce((taxTotal, tax) => (
                                            taxTotal + (tax.TaxRate * product.BilledQuantity)
                                        ), ((product.BilledQuantity * parseFloat(product.UnitRate))) || 0)
                                    ), 0).toFixed(2)}
                                </span>
                            </Typography>
                        </Box>
                    </TableContainer>



                </Box >
                <Grid container justifyContent="flex-end" mt={2}>
                    <Button
                        type="submit"
                        name="Save"
                        variant='contained'
                        loading={purchaseOrderListLoading}
                        disabled={purchaseOrderListLoading}
                    />
                </Grid>

            </ValidatorForm >

        </Box >
    )
}

export default PurchaseOrderForm