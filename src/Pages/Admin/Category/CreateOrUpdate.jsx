import {
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Box,
  Spinner,
} from "@chakra-ui/react";
import Select from "react-select";
import { useEffect, useState } from "react";
import { createCategoryService, editCategoryService } from "../../../Services/Category";
import { useDropzone } from 'react-dropzone';
import { FaFileImage } from "react-icons/fa";
import { getUrlUploadedService } from '../../../Services/Resource';
import { useTranslation } from 'react-i18next';
import { _t } from "../../../Utils/_t";

const CreateOrUpdateCategory = ({ isModalOpen, onCloseModal, id = 0, categories, setCategories }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState(-1);
  const [imageUrl, setImageUrl] = useState('');
  const [isuploading, setIsuploading] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const toast = useToast();

  const blackList = getAllChildren();

  var categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
    id: category.id,
  }))
  categoryOptions.unshift({
    value: -1,
    label: "root",
    id: -1
  })
  categoryOptions = categoryOptions?.filter(category => (blackList.indexOf(category.id) === -1))

  const getSlug = (_name) => {
    let _slug = _name.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
    return _slug;
  }

  const handleSetName = (_name) => {
    setName(_name)
    setSlug(getSlug(_name))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
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
            setImageUrl(result.data.url);
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

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault()
    const data = {
      name: name,
      slug: slug,
      parent_id: parentId,
      image_url: imageUrl
    }
    if (id === 0) {
      setIsloading(true)
      var response = await createCategoryService(data)
      setIsloading(false)
      if (response.status === 200) {
        toast({
          title: t(_t('Success.')),
          description: t(_t('Creating category success')),
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setCategories([...categories, {
          id: response?.data?.data,
          status: 1,
          ...data
        }].sort((a, b) => (a.name.localeCompare(b.name))))
        onCloseModal(false)
      } else {
        toast({
          title: t(_t('Error.')),
          description: response?.response?.data?.message,
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } else {
      setIsloading(true)
      let response = await editCategoryService({
        id: id,
        ...data,
        status: categories.find(category => (category.id === id)).status
      })
      setIsloading(false)
      if (response.status === 200) {
        toast({
          title: t(_t('Success.')),
          description: t(_t('Updating category success')),
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setCategories(categories.map(category => (category.id !== id ? category : {
          id: id,
          status: category.status,
          ...data
        })).sort((a, b) => (a.name.localeCompare(b.name))))
        onCloseModal(false)
      } else {
        toast({
          title: t(_t('Error.')),
          description: response?.response?.data?.message,
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
    // console.log(name, slug, parentId, imageUrl)
  }

  function getAllChildren() {
    // var res = [];
    var que = [id];
    var index = 0;
    while (index < que.length) {
      var cur = que[index];
      // var isParent = false;
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].parent_id === cur) {
          que.push(categories[i].id);
          // isParent = true;
        }
      }
      // if (!isParent)
      //   res.push(cur);
      index++;
    }
    return que;
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = categories.find(category => (category.id === id));
      setName(data?.name ?? '');
      setSlug(data?.slug ?? '');
      setParentId(data?.parent_id ?? -1);
      setImageUrl(data?.image_url ?? '');
    }

    const setData = () => {
      setName('');
      setSlug('');
      setParentId(-1);
      setImageUrl('');
    }

    id > 0 ? fetchData() : setData();
  }, [id]);

  return (
    <Modal isOpen={isModalOpen} onClose={onCloseModal} closeOnOverlayClick={false} size={'4xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{id > 0 ? t(_t('Edit Category')) : t(_t('Create Category'))}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleCreateOrUpdate}>
          <ModalBody>
            <FormControl mt={5} isRequired>
              <FormLabel>{t(_t('Name'))}</FormLabel>
              <Input type="text" value={name} onChange={(e) => { handleSetName(e.target.value) }} />
            </FormControl>
            <FormControl mt={5} isRequired>
              <FormLabel>{t(_t('Slug'))}</FormLabel>
              <Input type="text" value={slug} isReadOnly />
            </FormControl>
            {/* <FormControl mt={5}>
              <FormLabel>{t(_t('Image URL'))}</FormLabel>
              <Input type="text" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value) }} />
              <Flex justifyContent="center" alignItems="center" h="120px">
                <Image src={imageUrl} alt={t(_t("Image not found"))} h={'100px'} w={'auto'} />
              </Flex>
            </FormControl> */}
            <FormControl mt={5}>
              <FormLabel
                fontWeight={600}
                htmlFor="image"
                mt="2%">
                {t(_t('Image URL'))}
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
                {imageUrl ?
                  <Image src={imageUrl} alt="Uploaded" m={'auto'} />
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
            <FormControl mt={5}>
              <FormLabel>{t(_t('Parent Category'))}</FormLabel>
              <Select
                size={'sm'}
                isSearchable={true}
                options={categoryOptions}
                value={categoryOptions.find(option => option.value === parentId)}
                onChange={(e) => {
                  setParentId(e.value)
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseModal}>{t(_t('Cancel'))}</Button>
            <Button
              isLoading={isloading}
              type="submit" colorScheme="blue" ml={3}
            >
              {id > 0 ? t(_t('Update')) : t(_t('Create'))}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default CreateOrUpdateCategory;