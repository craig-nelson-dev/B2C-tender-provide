import React, { useState, useContext } from "react";
import { GlobalContext } from "../../Components/GlobalContext";
import {
  Box,
  ButtonGroup,
  Button,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Text,
  useToast,
  Image,
  Spinner,
  Tabs,
  TabList,
  Tab,
} from '@chakra-ui/react'
import Select from "react-select";
import { useDropzone } from 'react-dropzone';
import { FaFileImage } from "react-icons/fa";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getUrlUploadedService } from '../../Services/Resource';
import { createDealService, updateDealService } from '../../Services/Deal';
import { Helmet } from 'react-helmet';
import { useTranslation } from "react-i18next";
import { _t } from "../../Utils/_t";
import { convertUTC } from "../../Utils/date";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function CreateOrUpdateDiscount({ discount = {}, onClose, onUpdate }) {
  const { t } = useTranslation()
  const { globalProps } = useContext(GlobalContext);
  const { categories, stores, config } = globalProps;
  const typeStr = ["discount_percent", "discount_fixed", "free"];

  const [url, setUrl] = useState(discount?.deal_url ?? '');
  const [images, setImages] = useState(discount?.image_urls ? JSON.parse(discount?.image_urls) : []);
  const [type, setType] = useState(discount?.type ? typeStr.indexOf(discount.type) : 0);
  const [price, setPrice] = useState(discount?.price_new ?? "0");
  const [title, setTitle] = useState(discount?.title ?? '');
  const [description, setDescription] = useState(discount?.description ?? '');
  const [categoryId, setCategoryId] = useState(discount?.category_id ?? -1);
  const [storeId, setStoreId] = useState(discount?.store_id ?? -1);
  const [startDate, setStartDate] = useState(convertUTC(discount.start_date));
  const [endDate, setEndDate] = useState(discount?.expires ?? convertUTC(null));
  const [isloading, setIsloading] = useState(false);
  const [isuploading, setIsuploading] = useState(false);
  const [code, setCode] = useState(discount?.code ?? "");
  const [isupdating, setIsupdating] = useState(false)
  const toast = useToast();
  const history = useHistory()

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['link'],
        [{ image: 'image' }],
        // [{ align: [] }],
        // [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ color: [] }, { background: [] }],
        ['clean']
      ],
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'link',
    'image',
    'align',
    'list',
    'ordered',
    'bullet',
    'color',
    'background',
    'clean',
  ];

  const categoryOptions = categories.map((category) => ({
    value: category.slug,
    label: category.name,
    id: category.id,
  }));

  const storeOptions = stores.map((store) => ({
    value: store.name,
    label: store.name,
    id: store.id,
  }));

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: async (acceptedFiles) => {
      setIsuploading(true);
      if (acceptedFiles.length === 0) {
        setIsuploading(false);
        return;
      }
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);

      getUrlUploadedService(formData)
        .then((result) => {
          setIsuploading(false);
          if (result && result.status === 200) {
            setImages([result.data.url]);
            toast({
              title: t(_t('Upload Success.')),
              description: t(_t("We've uploaded your image.")),
              position: 'top',
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
          } else {
            toast({
              title: t(_t('Error.')),
              description: result?.response?.data.message,
              position: 'top',
              status: 'error',
              duration: 3000,
              isClosable: true,
            })
          }
        })
        .catch((error) => {
          setIsuploading(false);
          toast({
            title: t(_t('Error.')),
            description: error.message,
            position: 'top',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        })
    }
  });

  const handleCreate = async () => {
    var sendData = {
      title: title,
      description: description,
      deal_url: url,
      image_urls: JSON.stringify(images),
      code: code
    };
    if (type <= 2) {
      sendData.type = typeStr[type];
      sendData.price_new = price;
    }
    if (categoryId !== -1) sendData.category_id = categoryId;
    if (storeId !== -1) sendData.store_id = storeId;
    if (startDate !== "") sendData.start_date = startDate;
    if (endDate !== "") sendData.expires = endDate;

    setIsloading(true);
    const response = await createDealService(sendData);
    setIsloading(false);
    if (response.status === 200) {
      setUrl("");
      setImages([]);
      setPrice("0");
      setTitle("");
      setDescription("");
      setStartDate(`${new Date(new Date().toUTCString()).getFullYear()}-${String(new Date(new Date().toUTCString()).getMonth() + 1).padStart(2, '0')}-${String(new Date(new Date().toUTCString()).getDate() - 1).padStart(2, '0')}`);
      setEndDate(`${new Date(new Date().toUTCString()).getFullYear()}-${String(new Date(new Date().toUTCString()).getMonth() + 1).padStart(2, '0')}-${String(new Date(new Date().toUTCString()).getDate() - 1).padStart(2, '0')}`);
      setCode("");
      toast({
        title: t(_t('Deal created.')),
        description: t(_t("We've created your deal.")),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      history.push("/")
    } else {
      toast({
        title: t(_t('Error.')),
        description: response.response?.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleUpdate = async () => {
    setIsupdating(true)
    var sendData = {
      deal_id: discount.id,
      title: title,
      description: description,
      type: typeStr[type],
      price_new: "" + price,
      deal_url: url,
      image_urls: JSON.stringify(images),
      category_id: categoryId,
      store_id: storeId,
      expires: endDate,
      code: code
    };
    var response = await updateDealService(sendData)
    if (response.status === 200) {
      delete sendData.deal_id
      sendData.id = discount.id
      onUpdate({
        ...sendData,
        storename: stores.find(store => store.id === storeId)?.name
      })
      onClose(false)
    } else {
      toast({
        title: t(_t('Error.')),
        description: response?.response?.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setIsupdating(false)
    }
  }

  return (
    <Box id="create_or_update_discount"
      maxW={discount.id ? 'auto' : '800px'}
      m={'auto'}
    >
      {!discount.id &&
        <Helmet>
          <title>{config?.site_title} - {t(_t("Share discounts"))}</title>
        </Helmet>
      }
      {!discount.id &&
        <Text
          fontSize={'2em'}
          textAlign={'center'}
          fontWeight={600}
          p={5}
        >
          {t(_t("Discount Info"))}
        </Text>
      }
      <Box
        bg={'white'}
        borderWidth={discount ? "0px" : "1px"}
        rounded="lg"
        shadow={discount.id ? "none" : "1px 1px 3px rgba(0,0,0,0.3)"}
        p={discount.id ? 0 : 6}
        m="10px auto"
        as="form"
      >
        <FormControl as={GridItem} colSpan={6}>
          <FormLabel
            fontWeight={600}
            htmlFor="url"
            mt="2%">
            {t(_t("URL"))}
          </FormLabel>
          <Input
            type="text"
            name="url"
            id="url"
            size="sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </FormControl>

        <FormControl as={GridItem} colSpan={6}>
          <FormLabel
            fontWeight={600}
            htmlFor="image"
            mt="2%">
            {t(_t("Image"))}
          </FormLabel>
          <Box
            {...getRootProps()}
            p={4}
            minHeight={'120px'}
            borderWidth={2}
            borderStyle="dashed"
            borderRadius="md"
            position={'relative'}
            textAlign="center"
            cursor="pointer"
            borderColor={isDragActive ? "blue.500" : "gray.200"}
          >
            <input {...getInputProps()} />
            {images.length > 0 ?
              <Image src={images[0]} alt="Uploaded" m={'auto'} />
              :
              <>
                <Box>
                  <FaFileImage size={24} />
                </Box>
                {!isuploading &&
                  <>
                    <Box mt={2} fontWeight="semibold" >
                      {isDragActive ? t(_t("Drop the image here")) : t(_t("Drag and drop an image here"))}
                    </Box>
                    <Box mt={2} fontSize="sm" color="gray.500">
                      {t(_t("Supported formats: JPEG, PNG"))}
                    </Box>
                  </>
                }
              </>
            }
            {isuploading &&
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="lg"
                position={'absolute'}
                top="calc(50%)"
                left="calc(50% - 20px)"
                transform="translate(-50%, -50%)"
                zIndex={1}
              />
            }
          </Box>
        </FormControl>

        <FormControl as={GridItem} colSpan={6}>
          <FormLabel
            fontWeight={600}
            htmlFor="url"
            mt="2%">
            {t(_t("Discount Code"))}
          </FormLabel>
          <Input
            type="text"
            name="url"
            id="url"
            size="sm"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </FormControl>

        <FormLabel
          fontWeight={600}
          htmlFor="url"
          mt="2%">
          {t(_t("Discount Type"))}
        </FormLabel>
        <Tabs defaultIndex={type}>
          <TabList
            as={Flex}
            border={'solid 1px'}
            borderColor={'blue.500'}
            borderRadius={5}
            justifyContent={'center'}
          >
            <Tab
              onClick={() => setType(0)}
              flex={1}
              fontSize={'0.9em'}
              fontWeight={600}
              borderWidth={0}
              borderRadius={5}
              _selected={{ bg: 'blue.500', color: 'white' }}
            >
              {t(_t("Percentage"))} (%)
            </Tab>
            <Tab
              onClick={() => setType(1)}
              flex={1}
              fontSize={'0.9em'}
              fontWeight={600}
              borderWidth={0}
              borderRadius={5}
              _selected={{ bg: 'blue.500', color: 'white' }}
            >
              {t(_t("Eruo"))} (€)
            </Tab>
            <Tab
              onClick={() => setType(2)}
              flex={1}
              fontSize={'0.9em'}
              fontWeight={600}
              borderWidth={0}
              borderRadius={5}
              _selected={{ bg: 'blue.500', color: 'white' }}
            >
              {t(_t("Free"))}
            </Tab>
          </TabList>
        </Tabs>

        {type !== 2 &&
          <FormControl as={GridItem} colSpan={6}>
            <FormLabel
              fontWeight={600}
              htmlFor="price_new"
              mt="2%"
            >
              Price {type === 0 ? '(%)' : '(€)'}
            </FormLabel>
            <Input
              type="text"
              name="price_new"
              id="price_new"
              size="sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </FormControl>
        }

        <FormControl as={GridItem} colSpan={6}>
          <FormLabel
            fontWeight={600}
            htmlFor="title"
            mt="2%">
            {t(_t("Title"))}
          </FormLabel>
          <Input
            type="text"
            name="title"
            id="title"
            size="sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl as={GridItem} colSpan={6}>
          <FormLabel
            fontWeight={600}
            htmlFor="description"
            mt="2%">
            {t(_t("Description"))}
          </FormLabel>
          <ReactQuill
            name="description"
            id="description"
            theme="snow"
            value={description}
            onChange={(content) => setDescription(content)}
            modules={modules}
            formats={formats}
          />
        </FormControl>

        <FormControl as={GridItem} colSpan={[6, 3]}>
          <FormLabel
            fontWeight={600}
            htmlFor="category"
            mt="2%"
          >
            {t(_t("Categories"))}
          </FormLabel>
          <Select
            name="category"
            placeholder={t(_t("Select Category"))}
            isSearchable={true}
            options={categoryOptions}
            value={categoryOptions.find((category) => category.id === categoryId)}
            onChange={(e) => setCategoryId(parseInt(e.id))}
          />
        </FormControl>

        <FormControl as={GridItem} colSpan={[6, 3]}>
          <FormLabel
            htmlFor="store"
            fontWeight={600}
            mt="2%"
          >
            {t(_t("Stores"))}
          </FormLabel>
          <Select
            name="store"
            placeholder={t(_t("Select Store"))}
            isSearchable={true}
            options={storeOptions}
            value={storeOptions.find((store) => store.id === storeId)}
            onChange={(e) => setStoreId(parseInt(e.id))}
          />
        </FormControl>
        {
          !discount.id &&
          <FormControl as={GridItem} colSpan={6}>
            <FormLabel
              fontWeight={600}
              htmlFor="start_date"
              mt="2%">
              {t(_t("Start Date"))}
            </FormLabel>
            <Input
              type="date"
              name="start_date"
              id="start_date"
              size="sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>
        }

        <FormControl as={GridItem} colSpan={6}>
          <FormLabel
            fontWeight={600}
            htmlFor="end_date"
            mt="2%">
            {t(_t("Expire Date"))}
          </FormLabel>
          <Input
            type="date"
            name="end_date"
            id="end_date"
            size="sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormControl>

        {!discount.id ?
          <ButtonGroup mt="5%" w="100%">
            <Flex w="100%" justifyContent="space-between">
              <Button
                colorScheme="teal"
                variant="outline"
                w="6rem"
                mr="5%"
                onClick={() => window.history.back()}
              >
                {t(_t("Back"))}
              </Button>
              <Button
                isLoading={isloading}
                w="6rem"
                colorScheme="blue"
                variant="solid"
                onClick={handleCreate}
              >
                {t(_t("Create"))}
              </Button>
            </Flex>
          </ButtonGroup> :
          <ButtonGroup mt="5%" w="100%">
            <Flex w="100%" justifyContent="space-between">
              <Button
                colorScheme="teal"
                variant="outline"
                w="6rem"
                mr="5%"
                onClick={() => onClose(false)}
              >
                {t(_t("Cancel"))}
              </Button>
              <Button
                isLoading={isupdating}
                w="6rem"
                colorScheme="blue"
                variant="solid"
                onClick={handleUpdate}
              >
                {t(_t("Update"))}
              </Button>
            </Flex>
          </ButtonGroup>
        }
      </Box>
    </Box>
  )
}