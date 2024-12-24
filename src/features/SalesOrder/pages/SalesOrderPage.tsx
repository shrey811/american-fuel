import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from '@mui/material'

import Button from 'components/Button/Button'
import GeneralCard from 'components/UI/GeneralCard'
import Log from 'features/GlobalLogs/Log'
import { useAppDispatch, useAppSelector } from 'hooks/useStore'
import React, { useState } from 'react'
import { shallowEqual } from 'react-redux'
import { toast } from 'react-toastify'
import { listSalesOrder, postIntuitSalesOrder, updateIntuitSalesOrder } from 'store/slices/salesOrderSlice'
import SalesOrderForm from './SalesOrderForm'
import SalesOrderList from './SalesOrderList'
import DropShippingForm from 'features/Setting/DropShipping/pages/DropShippingForm'
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    editData?: any
    setEditData?: any;
    toggleForm: () => void;
}

const SalesOdrderPage = (props: Props) => {
    const dispatch = useAppDispatch();
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = React.useState<any>();
    const [openDropshipForm, setOpenDropshipForm] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    console.log({ SalesPage: editData })
    // console.log('selectedIds', 'selectedId', selectedIds)
    // const toggleForm = () => {
    //     setShowForm((prev) => !prev);
    // };

    const toggleForm = () => {
        if (showForm) {
            setEditData(null)
        }
        setShowForm(!showForm);
    };

    const handleOpenDropshipForm = () => {
        setOpenDropshipForm(true);
    };

    const handleCloseDropshipForm = () => {
        setOpenDropshipForm(false);
    };

    const [salesOrderList, updateIntuitSalesOrderLoading] = useAppSelector(
        (state) => [
            state.salesOrderReducers.salesOrderList,
            state.salesOrderReducers.updateIntuitSalesOrderLoading,
        ],
        shallowEqual
    );

    const [salesOrderList2, postIntuitSalesOrderLoading] = useAppSelector(
        (state) => [
            state.salesOrderReducers.salesOrderList,
            state.salesOrderReducers.postIntuitSalesOrderLoading,
        ],
        shallowEqual
    );

    // const handleUpdateIntuitData = async () => {
    //     try {
    //         const action = await dispatch(updateIntuitSalesOrder());
    //         const response = action.payload
    //         updateIntuitSalesOrderLoading;

    //         if ("Add Sales is successful") {
    //             dispatch(listSalesOrder())
    //         }
    //         toast.success(response.message.message);
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("An error occurred while updating Intuit data.");
    //     }
    // };

    const handlePostIntuitData = async () => {
        try {

            const action = await dispatch(postIntuitSalesOrder());
            const response = action.payload
            updateIntuitSalesOrderLoading;

            if (response.message.code === "SUCCESS") {
                dispatch(listSalesOrder());
                toast.success(response.message.message);
            }
            if (response.message.code === 'FAILED') {
                console.log('response.code', response.code);
                toast.error(response.message.message);
            }
        } catch (error: any) {
            console.log(error);
            const errorMessage = "An error occurred while posting Intuit data.";
            console.log({ errorMessage })
            toast.error(errorMessage);
        }
    };
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
                <GeneralCard title={"Sales Order"}
                    add={!showForm ? toggleForm : undefined}
                    // back={showForm ? toggleForm : undefined}
                    arrowLeft={showForm ? toggleForm : null}
                    // LeftArrow={showForm ? toggleForm : null}
                    addLabel='Create Sales Order'
                >
                    <Box>
                        <Grid item xs={12} sm={12}>
                            {
                                showForm ? (
                                    <Grid item xs={12} sm={12}>
                                        <SalesOrderForm editData={editData} setEditData={setEditData} productList={[]} toggleForm={toggleForm} />

                                    </Grid>
                                ) : (
                                    <>
                                        <Box sx={{ float: 'right', py: 2, position: 'absolute', right: '9rem', top: '0' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleOpenDropshipForm}
                                                disabled={selectedIds.length === 0}
                                            >
                                                Create Dropship Order
                                            </Button>
                                        </Box>
                                        <Box sx={{ float: 'right', py: 2, position: 'absolute', right: '19rem', top: '0' }}>
                                            <Button variant="contained" color="primary"
                                                onClick={handlePostIntuitData}
                                                loading={postIntuitSalesOrderLoading}
                                                disabled={postIntuitSalesOrderLoading}>
                                                Update Intuit Data
                                            </Button>
                                        </Box>
                                        {/* <Box sx={{ py: 2 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleOpenDropshipForm}
                                            >
                                                Open Dropship Form
                                            </Button>
                                        </Box> */}

                                        <Grid item xs={12} sm={12} mt={2}>
                                            <SalesOrderList
                                                setEditData={setEditData}
                                                toggleForm={toggleForm}
                                                onSelectId={setSelectedIds}
                                            />

                                        </Grid>

                                    </>
                                )
                            }
                        </Grid>
                    </Box>
                </GeneralCard>
            </Grid>

            <Dialog
                open={openDropshipForm}
                onClose={handleCloseDropshipForm}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>

                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleCloseDropshipForm}
                        sx={{ position: 'absolute', right: 30, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DropShippingForm selectedIds={selectedIds} handleCloseDropshipForm={handleCloseDropshipForm} /> {/* Pass selected IDs to DropShippingForm */}
                </DialogContent>
            </Dialog>
        </Grid>
    )
}

export default SalesOdrderPage