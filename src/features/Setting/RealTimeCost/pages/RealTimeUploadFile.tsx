import React, { useState } from 'react';
import {
  Box,
  ListItemIcon,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import moment from 'moment';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listRealTimeCost, uploadRealTimeCost } from 'store/slices/realtimecostSlice';
import Button from 'components/Button/Button';
import GeneralModal from '../../../../components/UI/GeneralModal';
import * as XLSX from 'xlsx';
import FileUpload from 'react-material-file-upload';
import RealTimeUploadEdit from './RealTimeUploadEdit';

interface Props { }

const RealTimeUploadFile = (props: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [editedRows, setEditedRows] = useState<any[]>([]);

  const [tableData, setTableData] = useState<{
    Vendors: string,
    Products: string,
    Terminals: string,
    Cost: string,
    EffectiveDateTime: string,
    State: string,
    City: string,
    CostType: string,
    ProductsCategory: string,
    SupplyFrom: string
  }[]>([]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setFile(null);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleEditClick = (row: any) => {
    setSelectedRow(row);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedData: any) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item === selectedRow ? updatedData : item
      )
    );
    setEditedRows((prevEditedRows) =>
      prevEditedRows.some((row) => row === selectedRow)
        ? prevEditedRows.map((row) => (row === selectedRow ? updatedData : row))
        : [...prevEditedRows, updatedData]
    );
    handleEditModalClose();
  };

  const dispatch = useAppDispatch();

  const handleSave = async () => {
    try {
      const formattedData = tableData.map((item) => ({
        EffectiveDateTime: item.EffectiveDateTime,
        Cost: parseFloat(item.Cost),
        VendorsDisplayName: item.Vendors,
        TerminalsName: item.Terminals,
        TerminalsState: item.State,
        TerminalsCity: item.City,
        ProductsName: item.Products,
        CostType: item.CostType,
        ProductsCategoryName: item.ProductsCategory,
        SupplyFrom: item.SupplyFrom
      }));

      const formData = {
        FileName: file ? file.name : null,
        ProductRealTimeCostList: formattedData
      };

      console.log({ formData });

      const action = await dispatch(uploadRealTimeCost(formData));
      const response = action.payload;
      if (response.message === 'Something went wrong.') {
        toast.error(response.message.message);
      } else {
        toast.success(response.message.message);
      }
      setFile(null);
      handleCloseModal();
      if (response.message.code === 'SUCCESS') {
        dispatch(listRealTimeCost());
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleFileChange = (files: File[]) => {
    const selectedFile = files && files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (selectedFile.name.endsWith('.csv')) {
          setFileData(data as string);
          const parsedData = parseCSV(data as string);
          setTableData(parsedData);
          setOpenModal(true);
        } else if (selectedFile.name.endsWith('.xlsx')) {
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const csvData = jsonData.map((row: any) => row.join(',')).join('\n');
          setFileData(csvData);
          const parsedData = parseCSV(csvData);
          setTableData(parsedData);
          setOpenModal(true);
        } else {
          toast.error('Unsupported file format');
        }
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const parseCSV = (csvData: string): {
    Vendors: string,
    Products: string,
    Terminals: string,
    Cost: string,
    EffectiveDateTime: string,
    State: string;
    City: string;
    CostType: string;
    ProductsCategory: string,
    SupplyFrom: string;
  }[] => {
    const rows = csvData.split('\n');
    const data: {
      Vendors: string,
      Products: string,
      Terminals: string,
      Cost: string,
      EffectiveDateTime: string,
      State: string;
      City: string;
      CostType: string;
      ProductsCategory: string,
      SupplyFrom: string;
    }[] = [];

    rows.forEach((row, index) => {
      if (index === 0) return; // Skip the header row

      const [Vendors, Products, Terminals, Cost, EffectiveDateTime, State, City, CostType, ProductsCategory, SupplyFrom] = row.split(',');

      console.log({ Vendors, Products, Terminals, Cost, EffectiveDateTime, State, City, CostType, ProductsCategory, SupplyFrom });

      // Validate the row data before pushing to the array
      if (Vendors && Products && Terminals && Cost && EffectiveDateTime) {
        data.push({ Vendors, Products, Terminals, Cost, EffectiveDateTime, State, City, CostType, ProductsCategory, SupplyFrom });
      } else {
        console.warn('Invalid row data, skipping:', { Vendors, Products, Terminals, Cost, EffectiveDateTime, State, City, CostType, ProductsCategory, SupplyFrom });
      }
    });

    console.log("Parsed Data: ", data); // Debugging line to verify all rows
    return data;
  };

  const [realtimeList, uploadRealTimeLoading] = useAppSelector(
    (state) => [
      state.realtimeReducers.realtimeList,
      state.realtimeReducers.uploadRealTimeLoading
    ],
    shallowEqual
  );

  return (
    <Box>
      <FileUpload value={file ? [file] : []} onChange={handleFileChange} />
      <GeneralModal open={openModal} handleClose={handleCloseModal} title="Upload Realtime Cost">
        <Box>
          <TableContainer sx={{ marginBottom: '10px', maxHeight: '400px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f5f5f5', whiteSpace: 'nowrap' }}>
                  <TableCell>Vendor Name</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Terminal Name</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Effective Date</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>CostType</TableCell>
                  <TableCell>Product Category</TableCell>
                  <TableCell>Supply From</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.Vendors}</TableCell>
                    <TableCell>{item.Products}</TableCell>
                    <TableCell>{item.Terminals}</TableCell>
                    <TableCell>{item.Cost}</TableCell>
                    <TableCell>{moment(item.EffectiveDateTime).format('MM/DD/YYYY HH:mm A')}</TableCell>
                    <TableCell>{item.State}</TableCell>
                    <TableCell>{item.City}</TableCell>
                    <TableCell>{item.CostType}</TableCell>
                    <TableCell>{item.ProductsCategory}</TableCell>
                    <TableCell>{item.SupplyFrom}</TableCell>
                    <TableCell>
                      <ListItemIcon sx={{ minWidth: '30px' }} onClick={() => handleEditClick(item)}>
                        <Tooltip title="Edit" placement="top" arrow>
                          <ModeEditOutlineIcon sx={{ cursor: 'pointer' }} />
                        </Tooltip>
                      </ListItemIcon>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            type="submit"
            name="Save"
            variant='contained'
            loading={uploadRealTimeLoading}
            disabled={uploadRealTimeLoading}
            onClick={handleSave}
          />
        </Box>
      </GeneralModal>
      <RealTimeUploadEdit open={editModalOpen} handleClose={handleEditModalClose} data={selectedRow} onSave={handleSaveEdit} />
    </Box>
  );
};

export default RealTimeUploadFile; 