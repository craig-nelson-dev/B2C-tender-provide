import React, { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../../../Components/GlobalContext";
import { Helmet } from "react-helmet";
import {
  Box,
  Input,
  Button,
  Progress,
  Heading,
  useToast,
  Flex,
  Spacer,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { _t } from "../../../Utils/_t";
import { setConfigService } from "../../../Services/Config";

const Setting = () => {
  const [siteName, setSiteName] = useState('');
  const [welcomeEmail, setWelcomeEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [popularShops, setPopularShops] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const { globalProps } = useContext(GlobalContext);
  const { categories, stores, config, _setConfig } = globalProps;
  const [isloading, setIsloading] = useState(false);
  const { t } = useTranslation();
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

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
    id: category.id,
  }))

  const storeOptions = stores.map((store) => ({
    value: store.name,
    label: store.name,
    id: store.id,
  }));

  const handleSave = async () => {
    setIsloading(true)
    var response = await setConfigService({
      site_title: siteName,
      welcome_email: welcomeEmail,
      language: language,
      popular_shops: JSON.stringify(popularShops.map(popularShop => popularShop.id)),
      popular_categories: JSON.stringify(popularCategories.map(popularCategory => popularCategory.id)),
      email: email,
      password: password
    })
    setIsloading(false)
    if (response.status === 200) {
      toast({
        title: t(_t('Success.')),
        description: t(_t('Resetting config success')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      _setConfig({
        site_title: siteName,
        welcome_email: welcomeEmail,
        language: language,
        popular_shops: JSON.stringify(popularShops.map(popularShop => popularShop.id)),
        popular_categories: JSON.stringify(popularCategories.map(popularCategory => popularCategory.id)),
        email: email,
        password: password
      })
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

  useEffect(() => {
    if (config?.popular_shops) {
      setPopularShops(storeOptions.filter(storeOption => (JSON.parse(config.popular_shops).indexOf(storeOption.id) >= 0)))
    }
    if (config?.popular_categories) {
      setPopularCategories(categoryOptions.filter(categoryOption => (JSON.parse(config.popular_categories).indexOf(categoryOption.id) >= 0)))
    }
    if (config?.site_title) {
      setSiteName(config.site_title)
    }
    if (config?.welcome_email) {
      setWelcomeEmail(config.welcome_email)
    }
    if (config?.language) {
      setLanguage(config.language)
    }
    if (config?.email) {
      setEmail(config.email)
    }
    if (config?.password) {
      setPassword(config.password)
    }
  }, [config])

  return (
    <>
      <Helmet>
        <title>{config?.site_title} - {t(_t("settings"))} </title>
      </Helmet>
      <Box maxW={'1200px'} m={'auto'}>
        <Box>
          <Heading textAlign={'center'} p={5} size={'lg'}>{t(_t('Settings'))}</Heading>
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
          <FormControl id="email" mt={5}>
            <FormLabel>{t(_t("Email"))}</FormLabel>
            <Input type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" mt={5}>
            <FormLabel>{t(_t("Password"))}</FormLabel>
            <Input type="text"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="site_name" mt={5}>
            <FormLabel>{t(_t("Site Name"))}</FormLabel>
            <Input type="text"
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
            />
          </FormControl>
          <FormControl id="welcome_message" mt={5}>
            <FormLabel>{t(_t("Welcome Message"))}</FormLabel>
            <ReactQuill
              name="banner"
              theme="snow"
              modules={modules}
              formats={formats}
              value={welcomeEmail}
              onChange={(content) => setWelcomeEmail(content)}
            />
          </FormControl>
          <FormControl id="select_language" mt={5}>
            <FormLabel>{t(_t("Language"))}</FormLabel>
            <RadioGroup value={language} onChange={(value) => setLanguage(value)}>
              <Stack direction="row">
                <Radio value="en">English</Radio>
                <Radio value="es">Español</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl id="popular_shops" mt={5}>
            <FormLabel>{t(_t("Popular Shops"))}</FormLabel>
            <Select
              options={storeOptions}
              value={popularShops}
              menuPortalTarget={document.body}
              onChange={(popularShops) => {
                setPopularShops(popularShops);
              }}
              isMulti
            />
          </FormControl>
          <FormControl id="popular_categories" mt={5}>
            <FormLabel>{t(_t("Popular Categories"))}</FormLabel>
            <Select
              options={categoryOptions}
              value={popularCategories}
              menuPortalTarget={document.body}
              onChange={(popularCategories) => {
                setPopularCategories(popularCategories);
                // console.log(popularCategories);
              }}
              isMulti
            />
          </FormControl>
        </Box>
        <Flex>
          <Spacer />
          <Button variant="outline" colorScheme="teal" onClick={() => window.history.back()} mt={2}>
            {t(_t('Back'))}
          </Button>
          <Button isLoading={isloading} colorScheme="blue" onClick={handleSave} m={2}>
            {t(_t('Save'))}
          </Button>
        </Flex>
      </Box>
    </>
  )
}

export default Setting;