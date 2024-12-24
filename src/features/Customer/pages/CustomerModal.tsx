import { Box, ListItemIcon, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline"
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import ConfirmationModal from 'components/UI/ConfirmationModal';
import useDeleteConfirmation from 'hooks/useDeleteConfirmation';
import { deleteCustomerAssest, updateCustomerAssest } from 'store/slices/customerassestsSlice';
import { toast } from 'react-toastify';
import { deleteShipAddress, updateShipAddress } from 'store/slices/shipaddressSlice';
import { deleteBillAddress, updateBillAddress } from 'store/slices/billaddressSlice';
import { shallowEqual } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const CustomerAssetsInitialValues = {
    Name: '',
    AssetType: '',
    Status: '',
}


const BillInitialValues = {
    Line1: '',
    Line2: '',
    Line3: '',
    Line4: '',
    Line5: '',
    City: '',
    CountrySubDivisionCode: '',
    Country: '',
    PostalCode: '',
    Lat: '',
    Long: '',
    IntuitId: '',
    Note: '',
    CustomerFId: '',
}

const ShipInitialValues = {
    Line1: '',
    Line2: '',
    Line3: '',
    Line4: '',
    Line5: '',
    City: '',
    CountrySubDivisionCode: '',
    Country: '',
    PostalCode: '',
    Lat: '',
    Long: '',
    Note: '',
    CustomerFId: '',
    IntuitId: '',
}

const CustomerModal = ({ customerData }: any) => {
    const dispatch = useAppDispatch();

    const [initialBillData, setInitialBillData] = useState<typeof BillInitialValues>({
        ...BillInitialValues
    });

    const [initialShipData, setInitialShipData] = useState<typeof ShipInitialValues>({
        ...ShipInitialValues
    });

    const [initialCustomerAssestData, setCustomerAssData] = useState<typeof CustomerAssetsInitialValues>({
        ...CustomerAssetsInitialValues
    })

    const [tabIndex, setTabIndex] = useState(0);
    const [open, setOpen] = useState(false);

    const { DisplayName, FamilyName, GivenName, Mobile, PrimaryPhone, AlternatePhone, Bill_address, Ship_address, Customer_assets } = customerData[0];

    const [editableIndex, setEditableIndex] = useState(null);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleTabChange = (event: any, newValue: any) => {
        setTabIndex(newValue);
    };

    const { editId, toggleModal, handleDeleteClick, resetDeleteData, modal } = useDeleteConfirmation();

    const handleEditBillClick = (index: any) => {

        setEditableIndex(index);
        // Get the address data for the selected index
        const addressData = Bill_address[index];
        // Update initialShipData with the address data
        setInitialBillData({
            ...BillInitialValues,
            ...addressData
        });
    };

    const handleEditShipClick = (index: any) => {

        setEditableIndex(index);
        // Get the address data for the selected index
        const addressData = Ship_address[index];
        // Update initialShipData with the address data
        setInitialShipData({
            ...ShipInitialValues,
            ...addressData
        });
    };

    const handleCancelEdit = () => {
        setEditableIndex(null);
    };
    const handleSaveBillEdit = async (Id: any) => {
        try {
            console.log("Editing asset with ID:", Id); // Log the ID before dispatching
            const action = await dispatch(updateBillAddress({
                bill_address_id: Id,
                ...initialBillData
            }));
            setInitialBillData({ ...BillInitialValues });
            const response = action.payload;
            toast.success("Data updated successfully");
            resetDeleteData();
            console.log({ response });
        } catch (error) {
            // Handle error
        }
    };


    const handleSaveShipEdit = async (Id: any) => {
        try {
            console.log("Editing asset with ID:", Id); // Log the ID before dispatching
            const action = await dispatch(updateShipAddress({
                ship_address_id: Id,
                ...initialShipData
            }));
            setInitialShipData({ ...ShipInitialValues });
            const response = action.payload;
            toast.success("Data updated successfully");
            resetDeleteData();
            console.log({ response });
        } catch (error) {
            // Handle error
        }
    };

    const handleSaveEdit = async (Id: any) => {
        try {
            console.log("Editing asset with ID:", Id); // Log the ID before dispatching
            const action = await dispatch(updateCustomerAssest({
                customerAssest_id: Id,
                ...initialCustomerAssestData
            }));
            const response = action.payload;
            toast.success("Data deleted successfully");
            resetDeleteData();
            console.log({ response });
        } catch (error) {
            // Handle error
        }
    };


    const deleteBill = async () => {
        try {
            const action = await dispatch(deleteBillAddress({ bill_address_id: editId }));
            const response = action.payload;
            toast.success("Data deleted successfully");
            // props.setEditData(null);
            resetDeleteData();
            // Reset delete confirmation state
            console.log({ response });
        } catch (error) {
            // Handle error
        }
    }
    const deleteShip = async () => {
        try {
            const action = await dispatch(deleteShipAddress({ ship_address_id: editId }));
            const response = action.payload;
            toast.success("Data deleted successfully");
            // props.setEditData(null);
            resetDeleteData();
            // Reset delete confirmation state
            console.log({ response });
        } catch (error) {
            // Handle error
        }
    }
    const deleteAssest = async () => {
        try {
            const action = await dispatch(deleteCustomerAssest({ customerAssest_id: editId }));
            const response = action.payload;
            toast.success("Data deleted successfully");
            // props.setEditData(null);
            resetDeleteData();
            // Reset delete confirmation state
            console.log({ response });
        } catch (error) {
            // Handle error
        }
    };
    return (
        <>
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab label="Customer Details" />

                <Tab label="Customer Assets" />
            </Tabs>

            <Box p={3}>
                {tabIndex === 0 && (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="customer-details-table">
                            <TableHead>
                                <TableRow sx={{ background: '#f5f5f5' }}>
                                    <TableCell>SN</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>DisplayName</TableCell>
                                    <TableCell>Mobile</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {customerData.map((customer: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{customer.GivenName}</TableCell>
                                        <TableCell>{customer.PrimaryPhone}</TableCell>
                                        <TableCell>{customer.Mobile}</TableCell>
                                        <TableCell>{customer.DisplayName}</TableCell>
                                        {/* Add more cells for other customer details */}
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>
                )}

                {tabIndex === 3 && (
                    <>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="billing-address-table">
                                <TableHead>
                                    <TableRow sx={{ background: '#f5f5f5' }}>
                                        <TableCell>Line1</TableCell>
                                        <TableCell>Line2</TableCell>
                                        <TableCell>Line3</TableCell>
                                        <TableCell>Line4</TableCell>
                                        <TableCell>Line5</TableCell>
                                        <TableCell>City</TableCell>
                                        <TableCell>CountrySubDivisionCode</TableCell>
                                        <TableCell>Country</TableCell>
                                        <TableCell>Lat</TableCell>
                                        <TableCell>Long</TableCell>
                                        <TableCell>Note</TableCell>
                                        <TableCell>Postal Code</TableCell>
                                        <TableCell>Action</TableCell>
                                        {/* Add more headings if needed */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Bill_address.map((address: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.Line1}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, Line1: e.target.value })}
                                                /> : address.Line1}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.Line2}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, Line2: e.target.value })}
                                                /> : address.Line2}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.Line3}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, Line3: e.target.value })}
                                                /> : address.Line3}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.Line4}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, Line4: e.target.value })}
                                                /> : address.Line4}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.Line5}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, Line5: e.target.value })}
                                                /> : address.Line5}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.City}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, City: e.target.value })}
                                                /> : address.City}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.CountrySubDivisionCode}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, CountrySubDivisionCode: e.target.value })}
                                                /> : address.CountrySubDivisionCode}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.Country}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, Country: e.target.value })}
                                                /> : address.Country}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.Lat}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, Lat: e.target.value })}
                                                /> : address.Lat}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.Long}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, Long: e.target.value })}
                                                /> : address.Long}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.Note}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, Note: e.target.value })}
                                                /> : address.Note}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.PostalCode}
                                                    onChange={(e) => setInitialBillData({ ...initialBillData, PostalCode: e.target.value })}
                                                /> : address.PostalCode}
                                            </TableCell>
                                            <TableCell>
                                                {editableIndex === index ? (
                                                    <>
                                                        <Tooltip title="Save" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer', marginRight: 1 }} onClick={() => handleSaveBillEdit(address.Id)}>
                                                                <SaveIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                        <Tooltip title="Cancel" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer' }} onClick={handleCancelEdit}>
                                                                <CancelIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Tooltip title="Edit" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer', marginRight: 1 }} onClick={() => handleEditBillClick(index)}>
                                                                <ModeEditOutlineIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(address.Id)}>
                                                                <DeleteOutlineIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </TableCell>
                                            {/* Add more cells for other address details */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <ConfirmationModal
                            open={modal}
                            handleModal={() => toggleModal()}
                            handleConfirmClick={() => deleteBill()}
                        />
                    </>
                )}

                {tabIndex === 2 && (
                    <>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="shipping-address-table">
                                <TableHead>
                                    <TableRow sx={{ background: '#f5f5f5' }}>
                                        <TableCell>Line1</TableCell>
                                        <TableCell>Line2</TableCell>
                                        <TableCell>Line3</TableCell>
                                        <TableCell>Line4</TableCell>
                                        <TableCell>Line5</TableCell>
                                        <TableCell>City</TableCell>
                                        <TableCell>CountrySubDivisionCode</TableCell>
                                        <TableCell>Country</TableCell>
                                        <TableCell>Lat</TableCell>
                                        <TableCell>Long</TableCell>
                                        <TableCell>Note</TableCell>
                                        <TableCell>Postal Code</TableCell>
                                        <TableCell>IntuitId</TableCell>
                                        <TableCell>Action</TableCell>

                                        {/* Add more headings if needed */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Ship_address.map((address: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{editableIndex === index ?
                                                <TextField
                                                    defaultValue={address.Line1}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, Line1: e.target.value })}
                                                /> : address.Line1}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.Line2}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, Line2: e.target.value })}
                                                /> : address.Line2}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.Line3}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, Line3: e.target.value })}
                                                /> : address.Line3}</TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.Line4}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, Line4: e.target.value })}
                                                /> : address.Line4}</TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.Line5}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, Line5: e.target.value })}
                                                /> : address.Line5}</TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.City}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, City: e.target.value })}
                                                /> : address.City}</TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.CountrySubDivisionCode}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, CountrySubDivisionCode: e.target.value })}
                                                /> : address.CountrySubDivisionCode}</TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.Country}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, Country: e.target.value })}
                                                /> : address.Country}</TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.Lat}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, Lat: e.target.value })}
                                                /> : address.Lat}</TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.Long}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, Long: e.target.value })}
                                                /> : address.Long}</TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.Note}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, Note: e.target.value })}
                                                /> : address.Note}</TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.PostalCode}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, PostalCode: e.target.value })}
                                                /> : address.PostalCode}</TableCell>

                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={address.IntuitId}
                                                    onChange={(e) => setInitialShipData({ ...initialShipData, IntuitId: e.target.value })}
                                                /> : address.PostalCode}</TableCell>
                                            <TableCell>
                                                {editableIndex === index ? (
                                                    <>
                                                        <Tooltip title="Save" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer', marginRight: 1 }} onClick={() => handleSaveShipEdit(address.Id)}>
                                                                <SaveIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                        <Tooltip title="Cancel" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer' }} onClick={handleCancelEdit}>
                                                                <CancelIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Tooltip title="Edit" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer', marginRight: 1 }} onClick={() => handleEditShipClick(index)}>
                                                                <ModeEditOutlineIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(address.Id)}>
                                                                <DeleteOutlineIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <ConfirmationModal
                            open={modal}
                            handleModal={() => toggleModal()}
                            handleConfirmClick={() => deleteShip()}
                        />
                    </>
                )}

                {tabIndex === 1 && (
                    <>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="customer-assets-table">
                                <TableHead>
                                    <TableRow sx={{ background: '#f5f5f5' }}>
                                        <TableCell>Asset Type</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Action</TableCell>
                                        {/* Add more headings if needed */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Customer_assets.map((asset: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={asset.AssetType}
                                                    onChange={(e) => setCustomerAssData({ ...initialCustomerAssestData, AssetType: e.target.value })}
                                                /> : asset.AssetType}
                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={asset.Name}
                                                    onChange={(e) => setCustomerAssData({ ...initialCustomerAssestData, Name: asset.Name })}
                                                /> : asset.Name}

                                            </TableCell>
                                            <TableCell>{editableIndex === index ?
                                                <TextField defaultValue={asset.Status}
                                                    onChange={(e) => setCustomerAssData({ ...initialCustomerAssestData, Status: e.target.value })}
                                                /> : asset.Status}</TableCell>
                                            <TableCell>
                                                {editableIndex === index ? (
                                                    <>
                                                        <Tooltip title="Save" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer', marginRight: 1 }} onClick={() => handleSaveEdit(asset.Id)}>
                                                                <SaveIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                        <Tooltip title="Cancel" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer' }} onClick={handleCancelEdit}>
                                                                <CancelIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Tooltip title="Edit" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer', marginRight: 1 }} onClick={() => handleEditClick(index)}>
                                                                <ModeEditOutlineIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" placement="top" arrow>
                                                            <ListItemIcon sx={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(asset.Id)}>
                                                                <DeleteOutlineIcon />
                                                            </ListItemIcon>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <ConfirmationModal
                            open={modal}
                            handleModal={() => toggleModal()}
                            handleConfirmClick={() => deleteAssest()}
                        />
                    </>
                )}


                {/* Similar implementation for other tabs */}
            </Box>
        </>
    );
}

export default CustomerModal;
