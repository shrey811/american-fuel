import { AddCircle } from '@mui/icons-material';
import {
    Autocomplete,
    Box,
    Grid,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    Divider,
    TableRow,
    Paper,
    ListItemIcon,
    Tooltip,
} from '@mui/material';
import Button from 'components/Button/Button';
import GeneralModal from 'components/UI/GeneralModal';
import PurchaseOrderForm from 'features/PurchaseOrder/pages/PurchaseOrderForm';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listCity } from 'store/slices/citySlice';
import { listCustomer } from 'store/slices/customerSlice';
import { addDropShip, addDropShipGeneraate, listDropShip, updateDropShip } from 'store/slices/dropShipSlice';
import { listProduct } from 'store/slices/productSlice';
import { stateList } from 'store/slices/stateSlice';
import { listAllTerminal } from 'store/slices/terminalSlice';
import { listVendor } from 'store/slices/vendorSlice';
import { VendorDataType } from 'types/Vendor';
import DropShipDetailsModal from './DropShippingModel';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
// import { dropshipAdd, dropshipPut } from 'store/slices/dropshipSlice';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
interface Props {
    editData?: any;
    setEditData?: any;
    backToList?: any;
    selectedIds: number[];
    handleCloseDropshipForm?: any;
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

const dropshipInitialValues = {
    VendorsFId: 0,
    BOL: '',
    TerminalsFId: 0,
    SODetails: [
        {
            ProductsFId: 0,
            BilledQuantity: 0,
            UnitRate: '',
            Amount: '',
            GrossQuantity: 0,
            Basis: '',
            NetQuantity: 0,
            SODocNumber: '',
            FreightAmount: 0,
            TaxAmount: 0,
            Id: 0,
            SOFId: 0,
            TaxesDetails: [],
        },
    ],

    OrderDateTime: '',
    LoadDateTime: '',
    VendorsAddressFId: 0,
    DeliveryDateTime: '',
    StateFId: 0,
    CitiesFId: 0,
    CarrierName: '',
    TruckName: '',
    DriverName: '',
    DocNumber: 0,
    CustomersFId: 0,
}
const DropShippingForm = (props: Props) => {

    const [initialData, setInitialData] = useState<typeof dropshipInitialValues>({
        ...dropshipInitialValues
    });

    const [selectedVendor, setSelectedVendor] = useState<VendorDataType | null>(null);
    const [addressOptions, setAddressOptions] = useState<AddressType[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const handleCloseModal = () => {
        setModalOpen(false);
    };
    const [selectedDropShipData, setSelectedDropShipData] = useState<typeof dropshipInitialValues>({
        ...dropshipInitialValues
    });
    const [modal, setModal] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);



    const toggleModal = () => {
        setModal(!modal);
    };

    const handleDeleteClick = (productId: any) => {
        setProductIdToDelete(productId);
        toggleModal(); // Open the confirmation modal
    };
    console.log('props.selectedId', props.selectedIds);

    const dispatch = useAppDispatch();
    useEffect(() => {
        // dispatch(listVendor());
        // dispatch(listAllTerminal());
        // dispatch(listProduct());
        // dispatch(listCustomer());
        // dispatch(stateList());
        // dispatch(listCity());

    }, []);

    useEffect(() => {
        if (props.selectedIds.length > 0) {
            dispatch(addDropShipGeneraate(props.selectedIds)).then((response) => {
                const salesData = response.payload.message.data;

                const updatedProducts = salesData.map((product: any) => ({

                    ProductsFId: product.ProductsFId,
                    NetQuantity: product.NetQuantity,
                    GrossQuantity: product.GrossQuantity,
                    BilledQuantity: product.BilledQuantity,
                    UnitRate: product.UnitRate,
                    FreightAmount: product.FreightAmount,
                    Amount: product.Amount,
                    SODocNumber: product.SODocNumber,
                    Basis: product.Basis,
                    Id: product.Id,

                }));


                setInitialData((prevData) => ({
                    ...prevData,
                    SODetails: updatedProducts,
                }));
            });
        }
    }, [dispatch, props.selectedIds]);


    useEffect(() => {
        console.log("props.editData", props.editData);

        if (props.editData) {
            const updatedProducts = props.editData.SODetails.map((product: any) => ({
                ProductsFId: product.ProductsFId,
                NetQuantity: product.NetQuantity,
                GrossQuantity: product.GrossQuantity,
                BilledQuantity: product.BilledQuantity,
                UnitRate: product.UnitRate,
                FreightAmount: product.FreightAmount,
                Amount: product.Amount,
                SODocNumber: product.SODocNumber,
                Basis: product.Basis,
                Id: product.Id
            }));
            setInitialData({
                ...props.editData,
                SODetails: updatedProducts,
            });
        } else {
            setInitialData(dropshipInitialValues);
        }
    }, [props.editData]);

    // useEffect(() => {
    //     console.log('props.editData:', props.editData);
    //     if (props.editData) {
    //         setInitialData({
    //             ...props.editData,
    //             ExpectedDateTime: moment.utc(props.editData.ExpectedDateTime).format('MM/DD/YYYYHH:mm:ss'),
    //             OrderDateTime: moment.utc(props.editData.OrderDateTime).format('MM/DD/YYYYHH:mm:ss'),
    //         });

    //     }

    // }, [props.editData]);

    console.log('dropshipInitialValues', dropshipInitialValues)



    const [vendorList, listVendorLoading] = useAppSelector(
        (state) => [
            state.vendorReducers.vendorList,
            state.vendorReducers.listVendorLoading
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
    console.log({ terminalList })

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

    const [customerList, listcustomerLoading] = useAppSelector(
        (state) => [
            state.customerReducers.customerList,
            state.customerReducers.listcustomerLoading
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
    useEffect(() => {
        if (props.editData) {
            setInitialData(props.editData);
        } else {
            setInitialData(dropshipInitialValues)
        }
    }, [props.editData]);
    useEffect(() => {
        console.log('props.editData:', props.editData);
        if (props.editData) {
            setInitialData({
                ...props.editData,
                LoadDateTime: moment.utc(props.editData.ExpectedDateTime).format('YYYY-MM-DD HH:mm:ss'),
                OrderDateTime: moment.utc(props.editData.OrderDateTime).format('YYYY-MM-DD HH:mm:ss'),
                DeliveryDateTime: moment.utc(props.editData.DeliveryDateTime).format('YYYY-MM-DD HH:mm:ss')
            });

        }

    }, [props.editData]);

    useEffect(() => {
        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 16);
        setInitialData(prevState => ({
            ...prevState,
            LoadDateTime: formattedDateTime,
            OrderDateTime: formattedDateTime,
            DeliveryDateTime: formattedDateTime,
        }));
    }, []);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setInitialData({ ...initialData, [name]: value });
    }
    const handleProductChange = (event: any, index: number, field: string) => {
        const { name, value } = event.target;
        const updatedProducts = [...initialData.SODetails];
        updatedProducts[index] = { ...updatedProducts[index], [field || name]: value };
        setInitialData({ ...initialData, SODetails: updatedProducts });
    };


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
    };

    const handleAddressChange = (event: any, value: AddressType | null) => {
        const addressId = value ? value.Id : 0;

        setInitialData(prevData => ({
            ...prevData,
            VendorsAddressFId: addressId,
            StateName: value ? getStateName(value.StatesFId) : '',
            CityName: value ? getCityName(value.CitiesFId) : '',
        }));
    };

    // const handleTerminalAddressChange = (event: any, value: AddressType | null) => {
    //     const addressId = value ? value.Id : 0;

    //     setInitialData(prevData => ({
    //         ...prevData,
    //         VendorsAddressFId: addressId,
    //         StateName: value ? getStateName(value.StatesFId) : '',
    //         CityName: value ? getCityName(value.CitiesFId) : '',
    //     }));
    // };


    useEffect(() => {
        if (props.editData) {
            // Step 1: Get the Vendor ID from props.editData
            const vendorId = props.editData.VendorsFId;

            // Step 2: Find the vendor using the Vendor ID
            const vendor = vendorList.find(v => v.Id === vendorId) || null;

            if (vendor) {
                // Step 3: Get the addresses of the vendor
                const addresses = vendor.Address || [];

                // Step 4: Map the VendorsAddressFId with the corresponding address
                const vendorsAddress = addresses.find(addr => addr.Id === props.editData.VendorsAddressFId) || null;

                // Set the address options for the Autocomplete
                setAddressOptions(addresses);

                // Set the selected vendor
                setSelectedVendor(vendor);

                // Step 5: Update the state with the retrieved address details
                setInitialData(prevData => ({
                    ...prevData,
                    VendorsFId: vendorId,
                    VendorsAddressFId: vendorsAddress ? vendorsAddress.Id : 0,
                    StateName: vendorsAddress ? getStateName(vendorsAddress.StatesFId) : '',
                    CityName: vendorsAddress ? getCityName(vendorsAddress.CitiesFId) : '',
                }));
            }
        }
    }, [props.editData, vendorList]);


    const getStateName = (stateId: number): string => {
        const state = stateListData.find(item => item.Id === stateId) || null;
        return state ? state.Name : '';
    };

    const getCityName = (cityId: number): string => {
        const city = listCityies.find(item => item.Id === cityId) || null;
        return city ? city.Name : '';
    };

    useEffect(() => {
        console.log('Modal Open State Updated:', modalOpen);
    }, [modalOpen]);

    const handleInputChange = (index: any, field: any, value: any) => {
        const updatedProducts = [...initialData.SODetails];
        updatedProducts[index] = { ...updatedProducts[index], [field]: value };
        setInitialData((prevData) => ({
            ...prevData,
            SODetails: updatedProducts,
        }));
    };

    const deleteTerminals = async () => {
        if (productIdToDelete !== null) {
            // Filter out the product with the matching ID
            const updatedSODetails = initialData.SODetails.filter(
                (product) => product.ProductsFId !== productIdToDelete
            );

            // Update the state with the new data
            setInitialData({
                ...initialData,
                SODetails: updatedSODetails,
            });

            // Close the modal
            toggleModal();
        }
    };

    const handleSubmit = async () => {
        try {


            const updatedProducts = initialData.SODetails.map((product, index) => {
                // Use the existing SOFId if available, otherwise assign a new one
                const existingSOFId = product.SOFId || (props.editData && props.editData.SODetails[index] && props.editData.SODetails[index].SOFId);
                const selectedId = existingSOFId || props.selectedIds[index % props.selectedIds.length] || null;

                return {
                    ...product,
                    SOFId: selectedId,
                    TaxAmount: 0,
                    TaxesDetails: [],
                };
            });

            // Update the initialData with the updatedProducts
            const updatedInitialData = {
                ...initialData,
                SODetails: updatedProducts,
                CustomersFId: initialData.CustomersFId,
                DeliveryDateTime: moment.utc(initialData.DeliveryDateTime).format(),
                OrderDateTime: moment.utc(initialData.OrderDateTime).format(),
                LoadDateTime: moment.utc(initialData.LoadDateTime).format()
            };
            if (props.editData) {
                // const dataWithId = { ...dataWithoutProducts, Id: props.editData.Id };
                const action = await dispatch(updateDropShip({
                    dropship_Id: props.editData.Id,
                    ...updatedInitialData // Use object without 'products' field
                }));
                setInitialData({ ...dropshipInitialValues });
                const response = action.payload;
                dispatch(listDropShip());
                toast.success(response.message.message);
                props.setEditData(null);
                props.backToList();
                props.handleCloseDropshipForm();
                // setModalOpen(false); // Close the modal after submitting

            } else {
                const action = await dispatch(addDropShip(updatedInitialData)); // Use object without 'products' field
                setInitialData({ ...dropshipInitialValues });
                const response = action.payload.message;

                let updatedDataWithId = { ...updatedInitialData } as typeof updatedInitialData & { DSOFId: number };

                if (response && response.data) {
                    updatedDataWithId = { ...updatedInitialData, DSOFId: response.data };  // Dynamically add 'DOFID'
                }

                // props.backToList();
                toast.success(response.message);
                setSelectedDropShipData(updatedDataWithId);
                setModalOpen(true);
                console.log('Modal should open now:', modalOpen); // Check modalOpen state
                // props.handleCloseDropshipForm();
            }
        } catch (error) {
            // toast.error("Something went wrong");
        }
    };

    const totalAmount = initialData.SODetails.reduce((sum, product) => sum + (parseFloat(product.Amount) || 0), 0);

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
            return initialData.TerminalsFId ? terminalList.find(item => item.Id === initialData.TerminalsFId) || null : null;
        }
    }

    const handleEditState = () => {
        if (props.editData) {
            return stateListData.find(item => item.Id === initialData.StateFId) || null;
        } else {
            return initialData.StateFId ? stateListData.find(item => item.Id === initialData.StateFId) || null : null;
        }
    }

    const handleEditCity = () => {
        if (props.editData) {
            return listCityies.find(item => item.Id === initialData.CitiesFId) || null;
        } else {
            return initialData.CitiesFId ? listCityies.find(item => item.Id === initialData.CitiesFId) || null : null;
        }
    }

    const handleEditProduct = (index: number) => {
        return productList.find(item => item.Id === initialData.SODetails[index].ProductsFId) || null;
    };

    return (
        <>
            <Box>
                <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
                    <Box>
                        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>DropShip Information </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
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
                                            name="VendorsFId"
                                            fullWidth
                                            style={{ marginTop: '9px' }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props}>{option.DisplayName}</li>
                                    )}
                                    noOptionsText={
                                        <li onClick={() => window.location.href = '/vendor'}>
                                            Create Supplier
                                        </li>
                                    }
                                />

                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <Autocomplete
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
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    fullWidth
                                    label="Order-Data-Time"
                                    name="OrderDateTime"
                                    value={initialData.OrderDateTime}
                                    type="datetime-local"
                                    style={{ marginTop: '9px' }}
                                    size="small"
                                    // validators={['required']}
                                    // errorMessages={['This field is required']}
                                    onChange={handleChange}
                                    variant="filled"
                                // sx={textFieldStyles}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    fullWidth
                                    label="Load-Data-Time"
                                    name="LoadDateTime"
                                    value={initialData.LoadDateTime}
                                    type="datetime-local"
                                    style={{ marginTop: '9px' }}
                                    size="small"
                                    // validators={['required']}
                                    // errorMessages={['This field is required']}
                                    onChange={handleChange}
                                    variant="filled"
                                // sx={textFieldStyles}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    fullWidth
                                    label="Delivery-Data-Time"
                                    name="DeliveryDateTime"
                                    value={initialData.DeliveryDateTime}
                                    type="datetime-local"
                                    style={{ marginTop: '9px' }}
                                    size="small"
                                    // validators={['required']}
                                    // errorMessages={['This field is required']}
                                    onChange={handleChange}
                                    variant="filled"
                                // sx={textFieldStyles}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    label="BOL"
                                    onChange={handleChange}
                                    name="BOL"
                                    value={initialData.BOL}
                                    // validators={['required']}
                                    // errorMessages={['This field is required']}
                                    sx={{ width: '100%', mt: 1 }}
                                    size="small"
                                    variant="filled"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Autocomplete
                                    options={terminalList}
                                    getOptionLabel={(option) => `${option.Name} (${option.Number})`}
                                    filterOptions={(options, { inputValue }) => {
                                        const lowerCaseInput = inputValue.toLowerCase();
                                        const filtered = options.filter(
                                            (option) =>
                                                option.Name.toLowerCase().startsWith(lowerCaseInput) ||
                                                option.Number.toLowerCase().startsWith(lowerCaseInput)
                                        );
                                        return filtered;
                                    }}

                                    value={handleEditTerminal()}
                                    onChange={(event, value) => handleChange({ target: { name: "TerminalsFId", value: value ? value.Id : '' } })}
                                    renderInput={(params) => <TextField
                                        {...params}
                                        label="Terminal name"
                                        variant="filled"
                                        size="small"
                                        required
                                        onChange={handleChange}
                                        value={initialData.TerminalsFId}
                                        style={{ marginTop: '9px' }}
                                        fullWidth
                                        name="TerminalsFId" />
                                    }

                                />
                            </Grid>

                            <Grid item xs={3} sm={3}>
                                {/* <Autocomplete
                                fullWidth
                                options={stateListData}
                                getOptionLabel={(option) => option.Name}
                                value={handleEditState()}
                                onChange={(event, value) => handleChange({ target: { name: "StateFId", value: value ? value.Id : '' } })}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label="State"
                                    variant="filled"
                                    size="small"
                                    onChange={handleChange}
                                    value={initialData.StateFId}
                                    style={{ marginTop: '9px' }}
                                    name="StatesFId" />
                                }
                            /> */}
                                <Autocomplete
                                    options={terminalList}
                                    fullWidth
                                    getOptionLabel={(option) => option.Address || ""}
                                    value={terminalList.find((option) => option.Id === initialData.TerminalsFId) || null}
                                    onChange={(event, value) => handleChange({ target: { name: "TerminalsFId", value: value ? value.Id : '' } })}
                                    renderInput={(params) => <TextField {...params}
                                        label="Select Terminal Address"
                                        variant="filled"
                                        size="small"
                                        style={{ marginTop: '9px' }}
                                    />}
                                />
                            </Grid>

                            {/* <Grid item xs={3}>
                            <Autocomplete
                                fullWidth
                                options={listCityies}
                                getOptionLabel={(option) => option.Name}
                                value={handleEditCity()}
                                onChange={(event, value) => handleChange({ target: { name: "CitiesFId", value: value ? value.Id : '' } })}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label="City"
                                    variant="filled"
                                    size="small"
                                    onChange={handleChange}
                                    value={initialData.CitiesFId}
                                    style={{ marginTop: '9px' }}
                                    name="CitiesFId" />
                                }
                            />

                        </Grid> */}
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    label="CarrierName"
                                    onChange={handleChange}
                                    name="CarrierName"
                                    value={initialData.CarrierName}
                                    // validators={['required']}
                                    // errorMessages={['This field is required']}
                                    sx={{ mt: 1 }}
                                    size="small"
                                    variant="filled"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    label="TruckName"
                                    onChange={handleChange}
                                    name="TruckName"
                                    value={initialData.TruckName}
                                    // validators={['required']}
                                    // errorMessages={['This field is required']}
                                    sx={{ mt: 1 }}
                                    size="small"
                                    variant="filled"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    label="DriverName"
                                    onChange={handleChange}
                                    name="DriverName"
                                    value={initialData.DriverName}
                                    // validators={['required']}
                                    // errorMessages={['This field is required']}
                                    sx={{ mt: 1 }}
                                    size="small"
                                    variant="filled"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                {props.editData && (
                                    <TextValidator
                                        fullWidth
                                        disabled
                                        label="DocNumber"
                                        style={{ marginTop: '9px' }}
                                        onChange={handleChange}
                                        name="DocNumber"
                                        // value={initialData.DocNumber}
                                        value={`DO-${initialData.DocNumber}`}
                                        size="small"
                                        variant="filled"
                                    // sx={textFieldStyles}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider sx={{ marginTop: 3, marginBottom: 2 }} />
                    <Box>
                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>Product Details</Typography>
                        {/* {initialData.SODetails.map((product, index) => ( */}
                        <>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow sx={{ background: '#EFEFEF' }}>
                                            <TableCell>SODocNumber</TableCell>
                                            <TableCell>Product Name</TableCell>
                                            <TableCell>Product Description</TableCell>
                                            <TableCell>GrossQuantity</TableCell>
                                            <TableCell>NetQuantity</TableCell>
                                            <TableCell>Action</TableCell>
                                            {/* <TableCell>Basis</TableCell>
                                            <TableCell>BilledQuantity</TableCell>
                                            <TableCell>UnitRate</TableCell>
                                            <TableCell>Amount</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {initialData.SODetails.map((product, index) => {
                                            // Extract the product details based on ProductsFId
                                            const productDetails = productList.find((option) => option.Id === product.ProductsFId);
                                            return (
                                                <TableRow key={index}>
                                                    {/* <TableCell>{productDetails ? productDetails.Name : 'Unknown Product'}</TableCell> */}
                                                    <TableCell>SO-{product.SODocNumber}</TableCell>
                                                    <TableCell>{productDetails ? productDetails.Name : 'Unknown Product'}</TableCell>

                                                    {/* Display the product description if found, otherwise show a fallback */}
                                                    <TableCell>{productDetails ? productDetails.Description : 'No Description Available'}</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            value={product.GrossQuantity}
                                                            onChange={(e) => handleInputChange(index, 'GrossQuantity', e.target.value)}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            value={product.NetQuantity}
                                                            onChange={(e) => handleInputChange(index, 'NetQuantity', e.target.value)}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="no-print" sx={{ minWidth: '30px' }}>
                                                        <ListItemIcon sx={{ minWidth: '30px' }} onClick={() => handleDeleteClick(product.ProductsFId)} className='demooooooooooooo'>
                                                            <Tooltip title="Delete" placement="top" arrow>
                                                                <DeleteOutlineIcon sx={{ cursor: 'pointer' }} />
                                                            </Tooltip>
                                                        </ListItemIcon>
                                                    </TableCell>
                                                    {/* <TableCell>
                                                        <TextField
                                                            value={product.Basis}
                                                            onChange={(e) => handleInputChange(index, 'Basis', e.target.value)}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            value={product.BilledQuantity}
                                                            onChange={(e) => handleInputChange(index, 'BilledQuantity', e.target.value)}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            value={product.UnitRate}
                                                            onChange={(e) => handleInputChange(index, 'UnitRate', e.target.value)}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </TableCell> */}
                                                    {/* <TableCell>
                                                        <TextField
                                                            type="number"
                                                            value={product.Amount}
                                                            onChange={(e) => handleInputChange(index, 'Amount', e.target.value)}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </TableCell> */}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/* <Grid container spacing={2} mt={1} key={index}>
                            <Grid item xs={12} sm={3}>
                                <Autocomplete
                                    options={productList}
                                    getOptionLabel={(option) => option.Name}
                                    disabled
                                    value={handleEditProduct(index)}
                                    onChange={(event, value) => handleProductChange({ target: { name: "ProductsFId", value: value ? value.Id : '' } }, index, "ProductsFId")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Product name"
                                            variant="filled"
                                            size="small"
                                            fullWidth
                                            disabled
                                            style={{ marginTop: '9px' }}
                                            name="ProductsFId"
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props}>{option.Name}</li>
                                    )}
                                    noOptionsText={
                                        <li onClick={() => window.location.href = '/product'}>Create Product</li>
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    label="SODocNumber"
                                    onChange={(event) => handleProductChange(event, index, "SODocNumber")}
                                    name="SODocNumber"
                                    value={product.SODocNumber}
                                    validators={['required']}
                                    errorMessages={['This field is required']}
                                    sx={{ width: '100%', mt: 1 }}
                                    size="small"
                                    variant="filled"
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    label="Billed Quantity"
                                    onChange={(event) => handleProductChange(event, index, "BilledQuantity")}
                                    name="BilledQuantity"
                                    value={product.BilledQuantity}
                                    validators={['required']}
                                    errorMessages={['This field is required']}
                                    sx={{ width: '100%', mt: 1 }}
                                    size="small"
                                    variant="filled"
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    label="Basis"
                                    onChange={(event) => handleProductChange(event, index, "Basis")}
                                    name="Basis"
                                    value={product.Basis}
                                    validators={['required']}
                                    errorMessages={['This field is required']}
                                    sx={{ width: '100%', mt: 1 }}
                                    size="small"
                                    variant="filled"
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    label="Gross Quantity"
                                    onChange={(event) => handleProductChange(event, index, "GrossQuantity")}
                                    name="GrossQuantity"
                                    value={product.GrossQuantity}
                                    validators={['required']}
                                    errorMessages={['This field is required']}
                                    sx={{ width: '100%', mt: 1 }}
                                    size="small"
                                    variant="filled"
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    label="Net Quantity"
                                    onChange={(event) => handleProductChange(event, index, "NetQuantity")}
                                    name="NetQuantity"
                                    value={product.NetQuantity}
                                    validators={['required']}
                                    errorMessages={['This field is required']}
                                    sx={{ width: '100%', mt: 1 }}
                                    size="small"
                                    variant="filled"
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    label="Unit Rate"
                                    onChange={(event) => handleProductChange(event, index, "UnitRate")}
                                    name="UnitRate"
                                    value={product.UnitRate}
                                    validators={['required']}
                                    errorMessages={['This field is required']}
                                    sx={{ width: '100%', mt: 1 }}
                                    size="small"
                                    variant="filled"
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextValidator
                                    label="Amount"
                                    onChange={(event) => handleProductChange(event, index, "Amount")}
                                    name="Amount    "
                                    value={product.Amount}
                                    validators={['required']}
                                    errorMessages={['This field is required']}
                                    sx={{ width: '100%', mt: 1 }}
                                    size="small"
                                    variant="filled"
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                        </Grid> */}
                        </>
                        {/* ))} */}
                        {/* <Typography sx={{ marginTop: "20px", marginBottom: "20px", textAlign: "end" }}>
                            <strong>
                                Total Amount: ${totalAmount.toFixed(2)}
                            </strong>
                        </Typography> */}
                    </Box>
                    <Grid container spacing={2} mt={1}>
                        <Grid container justifyContent="flex-end" mt={2}>
                            <Button
                                type="submit"
                                name="Save"
                                variant='contained'
                            />
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </Box >
            <DropShipDetailsModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                // toggle={handleCloseModal}
                dropShipData={selectedDropShipData}
            />
            <ConfirmationModal
                open={modal}
                handleModal={toggleModal}
                handleConfirmClick={deleteTerminals}
            />
        </>
    )
}

export default DropShippingForm;
