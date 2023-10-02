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
import { useEffect, useState } from "react";
import { createStoreService, getStoreByIdService, updateStoreService } from "../../../Services/Store";
import { useDropzone } from 'react-dropzone';
import { FaFileImage } from "react-icons/fa";
import { getUrlUploadedService } from '../../../Services/Resource';
import ReactQuill from 'react-quill';
import { useTranslation } from 'react-i18next';
import { _t } from "../../../Utils/_t";
import { useContext } from "react";
import { GlobalContext } from "../../../Components/GlobalContext";

const CreateOrUpdateStore = ({ isModalOpen, onCloseModal, id = 0 }) => {
  const { t } = useTranslation();
  const [isuploading, setIsuploading] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [blog, setBlog] = useState('');
  const { globalProps } = useContext(GlobalContext);
  const { stores, _setStores } = globalProps;
  const toast = useToast();

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

  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true);
      const data = await getStoreByIdService(id);
      setName(data?.name ?? '');
      setUrl(data?.url ?? '');
      setImage(data?.image ?? '');
      setBlog(data?.blog ?? '');
      setIsloading(false);
    }

    const setData = () => {
      setName('');
      setUrl('');
      setImage('');
      setBlog('');
    }

    id > 0 ? fetchData() : setData();
  }, [id]);

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
            setImage(result.data.url);
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

  const handleCreateStore = async (e) => {
    e.preventDefault()
    const data = {
      name: name,
      url: url,
      image: image,
      blog: blog
    }
    if (id === 0) {
      setIsloading(true)
      var response = await createStoreService(data)
      setIsloading(false)
      if (response.status === 200) {
        toast({
          title: t(_t('Success.')),
          description: t(_t('Creating store success')),
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        _setStores([...stores, {
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

      let response = await updateStoreService({
        id: id,
        ...data,
        status: stores.find(store => (store.id === id)).status
      })
      setIsloading(false)
      if (response.status === 200) {
        toast({
          title: t(_t('Success.')),
          description: t(_t('Updating store success')),
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        _setStores(stores.map(store => (store.id !== id ? store : {
          id: id,
          status: store.status,
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
    // console.log(name, url, image, blog)
  }

  return (
    !isloading &&
    <Modal isOpen={isModalOpen} onClose={onCloseModal} closeOnOverlayClick={false} size={'4xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{id > 0 ? t(_t('Edit Store')) : t(_t('Create Store'))}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleCreateStore}>
          <ModalBody>
            <FormControl mt={5} isRequired>
              <FormLabel>{t(_t('Name'))}</FormLabel>
              <Input type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
            </FormControl>
            <FormControl mt={5} isRequired>
              <FormLabel>{t(_t('URL'))}</FormLabel>
              <Input type="text" value={url} onChange={(e) => { setUrl(e.target.value) }} />
            </FormControl>
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
                {image ?
                  <Image src={image} alt="Uploaded" m={'auto'} />
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
              <FormLabel>{t(_t('Info HTML'))}</FormLabel>
              <ReactQuill
                name="info_html"
                theme="snow"
                modules={modules}
                formats={formats}
                value={blog}
                onChange={(content) => setBlog(content)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseModal}>{t(_t('Cancel'))}</Button>
            <Button isLoading={isloading} type="submit" colorScheme="blue" ml={3}>{id > 0 ? t(_t('Update')) : t(_t('Create'))}</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default CreateOrUpdateStore;