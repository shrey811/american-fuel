import { Autocomplete, Box, Grid, MenuItem, TextField } from '@mui/material';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { addFreightRule, listFreightRule, putFreightRule } from 'store/slices/freightRuleSlice';
import { listProductCategory } from 'store/slices/productCategorySlice';
import { listProduct } from 'store/slices/productSlice';

interface Props {
  editData?: any;
  setEditData?: any;
  backToList?: any;
}

const freightInitialValues = {
  PCFId: 0,
  ProductsFId: 0,
  Markup: '',
  Rate: 0,
  Unit: 'per gallon'
}

const FreightRuleForm = (props: Props) => {
  const [initialData, setInitialData] = useState<typeof freightInitialValues>(freightInitialValues);
  const [markup, setMarkup] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(listProductCategory());
    dispatch(listProduct());
  }, [dispatch]);

  const [freightList, freightListLoading] = useAppSelector(
    (state) => [
      state.freightReducers.freightRuleListData,
      state.freightReducers.freightLoading,
    ],
    shallowEqual
  );

  const [productCategoryList, listProductCategoryLoading] = useAppSelector(
    (state) => [
      state.productCategoryReducers.productCategoryList,
      state.productCategoryReducers.listProductCategoryLoading
    ],
    shallowEqual
  );

  const [listCategoryProducts, listCategoryProductsLoading] = useAppSelector(
    (state) => [
      state.productReducers.productList,
      state.productReducers.listCateogryProductsLoading
    ],
    shallowEqual
  );

  useEffect(() => {
    if (selectedCategory) {
      const products = listCategoryProducts.filter(product => product.ProductCategoryFId === selectedCategory.Id);
      setFilteredProducts(products);
      setInitialData((prevData) => ({ ...prevData, PCFId: selectedCategory.Id }));
    } else {
      setFilteredProducts([]);
      setInitialData((prevData) => ({ ...prevData, PCFId: 0 }));
    }
  }, [selectedCategory, listCategoryProducts]);

  useEffect(() => {
    if (selectedProduct) {
      setInitialData((prevData) => ({ ...prevData, ProductsFId: selectedProduct.Id }));
    } else {
      setInitialData((prevData) => ({ ...prevData, ProductsFId: 0 }));
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (props.editData) {
      setInitialData(props.editData);
      setMarkup(props.editData.Markup);
      setSelectedCategory(productCategoryList.find(category => category.Id === props.editData.PCFId) || null);
      setSelectedProduct(listCategoryProducts.find(product => product.Id === props.editData.ProductsFId) || null);
    } else {
      setInitialData(freightInitialValues);
      setSelectedCategory(null);
      setSelectedProduct(null);
    }
  }, [props.editData, productCategoryList, listCategoryProducts]);

  const handleCategoryChange = (event: any, value: any) => {
    setSelectedCategory(value);
  };

  const handleProductChange = (event: any, value: any) => {
    setSelectedProduct(value);
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "Markup") {
      setMarkup(value);
    }
    setInitialData((prevData) => ({ ...prevData, [name]: value }));
  }

  const handleSubmit = async () => {
    try {
      if (props.editData) {
        const action = await dispatch(putFreightRule({
          freight_id: props.editData.Id,
          ...initialData
        }));
        setInitialData(freightInitialValues);
        setSelectedCategory(null);
        setSelectedProduct(null);
        const response = action.payload;
        toast.success(response.message.message);
        props.setEditData(null);
        props.backToList();
        if (response.message.code === "SUCCESS") {
          dispatch(listFreightRule());
        }
      } else {
        const action = await dispatch(addFreightRule(initialData));
        setInitialData(freightInitialValues);
        setSelectedCategory(null);
        setSelectedProduct(null);
        const response = action.payload;
        props.backToList();
        toast.success(response.message.message);
        if (response.message.code === "SUCCESS") {
          await dispatch(listFreightRule());
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Box>
      <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={1} mt={1}>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              disablePortal
              id="product-category-autocomplete"
              options={productCategoryList || []}
              fullWidth
              getOptionLabel={(option) => option.Name || ""}
              value={selectedCategory}
              onChange={handleCategoryChange}
              renderInput={(params) => <TextField {...params}
                label="Product Category"
                variant="filled"
                size="small"
              />}
              loading={listProductCategoryLoading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              disablePortal
              id="products-autocomplete"
              options={filteredProducts || []}
              fullWidth
              getOptionLabel={(option) => option.Name || ""}
              value={selectedProduct}
              onChange={handleProductChange}
              renderInput={(params) => <TextField {...params}
                label="Products"
                variant="filled"
                size="small"
              />}
              loading={listCategoryProductsLoading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              select
              label="Markup"
              name="Markup"
              value={initialData.Markup}
              onChange={handleChange}
              validators={['required']}
              errorMessages={['This field is required']}
              fullWidth
              size="small"
              variant="filled"
            >
              <MenuItem value="percent">Percent %</MenuItem>
              <MenuItem value="unit">Unit</MenuItem>
            </TextValidator>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              label="Price"
              type='number'
              name="Rate"
              value={initialData.Rate}
              onChange={handleChange}
              validators={['required']}
              errorMessages={['This field is required']}
              fullWidth
              size="small"
              variant="filled"
            // disabled={markup !== 'percent'}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              select
              label="Unit"
              name="Unit"
              value={initialData.Unit}
              onChange={handleChange}
              validators={['required']}
              errorMessages={['This field is required']}
              fullWidth
              size="small"
              variant="filled"
              disabled={markup !== 'unit'}
            >
              <MenuItem value="per gallon">Per Gallon</MenuItem>
            </TextValidator>
          </Grid>
          <Grid container justifyContent="flex-end" mt={2}>
            <Button
              type="submit"
              name="Save"
              variant='contained'
              loading={freightListLoading}
              disabled={freightListLoading}
            />
          </Grid>
        </Grid>
      </ValidatorForm>
    </Box>
  )
}

export default FreightRuleForm;