import React, { useState, useContext } from "react";
import { GlobalContext } from "../../../Components/GlobalContext";
import ChollitosTable from "../../../Components/DataTable";
import { Helmet } from "react-helmet";
import {
  Flex,
  Spacer,
  Box,
  Button,
  Icon,
  Progress,
  Badge,
  Avatar,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { activateCategoryService, deactivateCategoryService } from "../../../Services/Category";
import CreateOrUpdateCategory from "./CreateOrUpdate";
import { FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { _t } from "../../../Utils/_t";

const AdminCategory = () => {
  const { globalProps } = useContext(GlobalContext);
  const { categories, _setCategories, config } = globalProps;
  const [tableIndex, setTableIndex] = useState(0);
  const [tableSize, setTableSize] = useState(5);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState([{ id: 'id', desc: true }]);
  const [isloading] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();

  const columns = [
    { Header: t(_t('ID')), accessor: 'id' },
    {
      Header: t(_t('Image')), accessor: 'image_url',
      Cell: ({ value, row }) => (
        <Avatar name={row.original.name} src={value} size="md" />
      ),
    },
    { Header: t(_t('Name')), accessor: 'name' },
    { Header: t(_t('Slug')), accessor: 'slug' },
    {
      Header: t(_t('Parent')), accessor: 'parent_id',
      Cell: ({ value }) => (
        categories.find(category => (category.id === value))?.name ?? "root"
      ),
    },
    {
      Header: t(_t('Status')), accessor: 'status',
      Cell: ({ value }) => (
        <Badge
          color={value ? "green" : "red"}
          bg={value ? "green.100" : "red.100"}
          size="sm"
          p={1}
        >
          {value ? t(_t('Active')) : t(_t('Deactive'))}
        </Badge>
      ),
    },
    {
      Header: t(_t('Actions')), accessor: 'status', id: 'actions',
      Cell: ({ value, row }) => (
        <>
          {value ?
            <Icon
              as={FaTimesCircle}
              color="red.500"
              boxSize={5}
              cursor={'pointer'}
              title={t(_t('deactivate'))}
              onClick={() => deactivateCategory(row.original.id)}
            />
            :
            <Icon
              as={FaCheckCircle}
              color="green.500"
              boxSize={5}
              cursor={'pointer'}
              title={t(_t('activate'))}
              onClick={() => activateCategory(row.original.id)}
            />
          }
          <Icon
            as={FaEdit}
            color="blue.500"
            boxSize={5}
            ml={1}
            cursor={'pointer'}
            title={t(_t('edit'))}
            onClick={() => openCreateOrEditCategoryModal(row.original.id)}
          />
        </>
      ),
    },
  ];

  const activateCategory = async (id) => {
    var response = await activateCategoryService(id);
    if (response.status === 200) {
      toast({
        title: t(_t('Success.')),
        description: t(_t('Activating category success')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      _setCategories(categories.map(category => (category.id !== id ? category : {
        ...category,
        status: 1
      })))
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

  const deactivateCategory = async (id) => {
    var response = await deactivateCategoryService(id);
    if (response.status === 200) {
      toast({
        title: t(_t('Success.')),
        description: t(_t('Deactivating category success')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      _setCategories(categories.map(category => (category.id !== id ? category : {
        ...category,
        status: 0
      })))
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

  const openCreateOrEditCategoryModal = (id) => {
    setCategoryId(id);
    setIsOpen(true);
  }

  const onCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>{config?.site_title} - {t(_t("shops"))} </title>
      </Helmet>
      <Box maxW={'1200px'} m={'auto'}>
        <Box>
          <Heading textAlign={'center'} p={5} size={'lg'}>{t(_t('Category Management'))}</Heading>
        </Box>
        {isloading ?
          <Progress colorScheme={'blue'} size="xs" isIndeterminate />
          :
          <Box p={'2px'} />
        }
        {categories?.length > 0 &&
          <Box
            bg={'white'}
            borderRadius={5}
            p={'20px'}
            shadow={'0 3px 3px rgba(0,0,0,.15), 0 0 0 rgba(0,0,0,.15)'}
          >
            <Flex mb={2}>
              <Spacer />
              <Button colorScheme="blue" onClick={() => openCreateOrEditCategoryModal(0)}>{t(_t('Create Category'))}</Button>
            </Flex>
            <ChollitosTable
              columns={columns}
              data={categories}
              index={tableIndex}
              setIndex={setTableIndex}
              size={tableSize}
              setSize={setTableSize}
              filter={filter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
            />
          </Box>

        }
        <CreateOrUpdateCategory
          key={"modalcreateupdate" + categoryId}
          isModalOpen={isOpen}
          onCloseModal={onCloseModal}
          id={categoryId}
          categories={categories}
          setCategories={_setCategories}
        />
      </Box>
    </>
  )
}

export default AdminCategory;