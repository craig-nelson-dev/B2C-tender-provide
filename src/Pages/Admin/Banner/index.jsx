import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Button,
  Progress,
  Heading,
  useToast,
  Flex,
  Spacer,
  FormControl,
  FormLabel,
  Code,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { _t } from "../../../Utils/_t";
import { getBannerService, saveBannerService } from "../../../Services/Banner";
import { GlobalContext } from "../../../Components/GlobalContext";

const Banner = () => {
  const { globalProps } = useContext(GlobalContext);
  const { config } = globalProps;
  const [title, setTitle] = useState('');
  const [banner, setBanner] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const toast = useToast();

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['link'],
        [{ image: 'image' }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
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

  const getBanner = async () => {
    setIsloading(true);
    const data = await getBannerService();
    setTitle(data.title)
    setBanner(data.content);
    setIsloading(false);
  };

  const handleBannerSave = async () => {
    setIsUpdating(true);
    var result = await saveBannerService({ title: title, content: banner });
    setIsUpdating(false);
    if (result.status === 200) {
      sessionStorage.setItem('banner', 'show');
      history.push('/');
      toast({
        title: t(_t('Save Success.')),
        description: t(_t("Successfully updated!")),
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
  }

  useEffect(() => {
    const fetchData = async () => {
      await getBanner();
    };

    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>{config?.site_title} - {t(_t("Banner"))} </title>
      </Helmet>
      <Box maxW={'1200px'} m={'auto'}>
        <Box>
          <Heading textAlign={'center'} p={5} size={'lg'}>{t(_t('Banner Management'))}</Heading>
        </Box>
        {isloading ?
          <Progress colorScheme={'blue'} size="xs" isIndeterminate />
          :
          <Box p={'2px'} />
        }
        <Box
          bg={'white'}
          borderRadius={5}
          p={'20px'}
          shadow={'0 3px 3px rgba(0,0,0,.15), 0 0 0 rgba(0,0,0,.15)'}
        >
          {/* <FormControl id="banner_title" mt={5}>
            <FormLabel>{t(_t("Title"))}</FormLabel>
            <Input type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </FormControl> */}
          <FormControl id="banner_content" mt={5}>
            <FormLabel>{t(_t("Content"))}</FormLabel>
            <ReactQuill
              name="banner"
              theme="snow"
              modules={modules}
              formats={formats}
              value={banner}
              onChange={(content) => setBanner(content)}
            />
          </FormControl>
          <FormControl id="preview_html" mt={5}>
            <FormLabel>{t(_t("Preview HTML"))}</FormLabel>
            <Code p={2}>{banner?.replace(/(data:image\/[^;]+;base64)([^"]*)/g, "$1,...")}</Code>
          </FormControl>
        </Box>
        <Flex>
          <Spacer />
          <Button variant="outline" colorScheme="teal" onClick={() => window.history.back()} mt={2}>
            {t(_t('Back'))}
          </Button>
          <Button isLoading={isUpdating} colorScheme="blue" onClick={handleBannerSave} m={2}>
            {t(_t('Save'))}
          </Button>
        </Flex>
      </Box>
    </>
  )
}

export default Banner;