import { useState, useEffect, useContext } from 'react';
import {
  activateUserService,
  deactivateUserService,
  deleteUserService,
  getAllUserService,
  updateRoleService
} from "../../../Services/User"
import ChollitosTable from "../../../Components/DataTable";
import { Helmet } from "react-helmet";
import {
  Box,
  Button,
  Icon,
  Progress,
  Badge,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import Select from "react-select";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { useTranslation } from 'react-i18next';
import { _t } from "../../../Utils/_t";
import { GlobalContext } from '../../../Components/GlobalContext';

const User = () => {
  const { globalProps } = useContext(GlobalContext);
  const { config } = globalProps;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(0);
  const [tableIndex, setTableIndex] = useState(0);
  const [tableSize, setTableSize] = useState(5);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState([{ desc: true }]);
  const [isloading, setIsloading] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const options = [
    { value: 'admin', label: t(_t('admin')) },
    { value: 'vip', label: t(_t('vip')) },
    { value: 'customer', label: t(_t('customer')) }
  ];

  const columns = [
    { Header: t(_t('ID')), accessor: 'id' },
    { Header: t(_t('Username')), accessor: 'username' },
    { Header: t(_t('Email')), accessor: 'email' },
    {
      Header: t(_t('Birthday')), accessor: 'birthday',
      Cell: ({ value }) => {
        const date = new Date(value);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return <span>{formattedDate}</span>;
      },
    },
    {
      Header: t(_t('Role')), accessor: 'role',
      Cell: ({ value, row }) => (
        <Box w={'100px'}>
          <Select
            size={'sm'}
            options={options}
            isSearchable={true}
            menuPortalTarget={document.body}
            value={options.find(option => option.value === value)}
            onChange={(e) => {
              setUserRole(row.original.id, e.value)
            }}
          />
        </Box>
      ),
    },
    {
      Header: t(_t('Status')),
      accessor: 'status',
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
      Header: t(_t('Actions')),
      accessor: 'status',
      id: 'actions',
      Cell: ({ value, row }) => (
        <>
          {value ?
            <Icon
              as={FaTimesCircle}
              color="red.500"
              boxSize={5}
              cursor={'pointer'}
              title={t(_t('deactivate'))}
              onClick={() => deactivateUser(row.original.id)}
            />
            :
            <Icon
              as={FaCheckCircle}
              color="green.500"
              boxSize={5}
              cursor={'pointer'}
              title={t(_t('activate'))}
              onClick={() => activateUser(row.original.id)}
            />
          }
          <Icon
            as={AiOutlineDelete}
            color="red.500"
            boxSize={5}
            cursor={'pointer'}
            title={t(_t('delete'))}
            onClick={() => {
              setDeleteUserId(row.original.id);
              onOpen();
            }}
          />
        </>
      ),
    },
  ];

  const getAllUser = async () => {
    setIsloading(true);
    const data = await getAllUserService();
    setIsloading(false);
    setUsers(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllUser();
    };

    fetchData();
  }, []);

  const activateUser = async (id) => {
    setIsloading(true);
    const response = await activateUserService(id);
    if (response.status === 200) {
      setUsers(users.map(user => (user.id !== id ? user : {
        ...user,
        status: 1
      })))
      toast({
        title: t(_t('Success.')),
        description: t(_t("Activating User Success")),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: t(_t('Error.')),
        description: response.response.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    setIsloading(false);
  }

  const deactivateUser = async (id) => {
    setIsloading(true);
    const response = await deactivateUserService(id);
    if (response.status === 200) {
      setUsers(users.map(user => (user.id !== id ? user : {
        ...user,
        status: 0
      })))
      toast({
        title: t(_t('Success.')),
        description: t(_t("Deactivating User Success")),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: t(_t('Error.')),
        description: response.response.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    setIsloading(false);
  }

  const deleteUser = async (id) => {
    setIsloading(true);
    const response = await deleteUserService(id);
    if (response.status === 200) {
      setUsers(users?.filter(user => (user.id !== id)))
      toast({
        title: t(_t('Success.')),
        description: t(_t("Deleting User Success")),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: t(_t('Error.')),
        description: response.response.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    setIsloading(false);
  }

  const setUserRole = async (id, role) => {
    setIsloading(true);
    const response = await updateRoleService(id, role);
    if (response.status === 200) {
      setUsers(users.map(user => (user.id !== id ? user : {
        ...user,
        role: role
      })))
      toast({
        title: t(_t('Success.')),
        description: t(_t("Changing Role of Role Success")),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: t(_t('Error.')),
        description: response.response.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    setIsloading(false);
  }

  return (
    <>
      <Helmet>
        <title>{config?.site_title} - {t(_t("users"))} </title>
      </Helmet>
      <Box maxW={'1200px'} m={'auto'}>
        <Box>
          <Heading textAlign={'center'} p={5} size={'lg'}>{t(_t('User Management'))}</Heading>
        </Box>
        {isloading ?
          <Progress colorScheme={'blue'} size="xs" isIndeterminate />
          :
          <Box p={'2px'} />
        }
        {users.length > 0 ?
          <Box
            bg={'white'}
            borderRadius={5}
            p={'20px'}
            shadow={'0 3px 3px rgba(0,0,0,.15), 0 0 0 rgba(0,0,0,.15)'}
          >
            <ChollitosTable
              columns={columns}
              data={users}
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
          : !isloading &&
          <Box
            bg={'white'}
            borderRadius={5}
            p={'20px'}
            shadow={'0 3px 3px rgba(0,0,0,.15), 0 0 0 rgba(0,0,0,.15)'}
            textAlign={'center'}
            fontWeight={600}
          >
            {t(_t('No Data'))}
          </Box>
        }
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t(_t("Delete User"))}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {t(_t("Are you sure?"))}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {t(_t("Cancel"))}
            </Button>
            <Button colorScheme="red" onClick={() => {
              deleteUser(deleteUserId);
              onClose();
            }}>
              {t(_t("Delete"))}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default User;