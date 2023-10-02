import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Badge,
  Button,
  Spacer,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Avatar,
  VStack,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react"
import { TimeIcon } from "@chakra-ui/icons";
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { GlobalContext } from "../../Components/GlobalContext";
import Carousel from "../../Components/Carousel"
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import 'react-quill/dist/quill.snow.css';
import { ChevronRightIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { MdHome } from "react-icons/md";
import { getStoreByNameService } from "../../Services/Store";
import { getDealByFilter } from "../../Services/Deal";
import { Helmet } from "react-helmet";
import { GetTimeDiff } from "../../Helpers";
import { useTranslation } from "react-i18next";
import { _t } from "../../Utils/_t";
import { addLikeDealService } from "../../Services/Like";

const Store = () => {
  const { globalProps } = useContext(GlobalContext);
  const { config } = globalProps;
  const { t } = useTranslation()
  const { store_name } = useParams();
  const [store, setStore] = useState(null);
  const [deals, setDeals] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const currentDate = new Date();
  const month = currentDate.toLocaleString('en-US', { month: 'long' });
  const appMode = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });
  const themeColor = 'blue.500';

  const getStoreByName = async () => {
    const store = await getStoreByNameService(store_name);
    setStore(store);
    await getDeals(store.id);
  }

  const getDeals = async (id) => {
    const tDeals = await getDealByFilter({
      type: "all",
      store_id: id,
      start_at: 0,
      length: 100
    })
    setDeals(tDeals)
  }

  const handleClick = (discount) => {
    setSelectedDiscount(discount);
    setIsOpen(true);
  }

  const getUrlFromTitle = (title) => {
    const _title = title.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
    if (_title.length > 30) {
      return _title.slice(0, 30) + "...";
    }
    return _title;
  }

  useEffect(() => {
    const fetchData = async () => {
      await getStoreByName();
    };

    fetchData();
  }, [store_name]);

  const DealHeader = ({ deal, setDeals, deals }) => {
    const toast = useToast()

    const handleLike = async (isLike) => {
      if (!localStorage.getItem('authToken')) {
        toast({
          title: t(_t('Warning.')),
          description: t(_t('Please login.')),
          position: 'top',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const result = await addLikeDealService({
        type: "deal",
        dest_id: deal.id,
        is_like: isLike
      });
      if (result.status === 200) {
        toast({
          title: t(_t('Success.')),
          description: t(_t('Thank you for your feedback.')),
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setDeals(deals.map(_deal => deal.id !== _deal.id ? _deal : {
          ..._deal,
          cnt_like: _deal.cnt_like + (isLike ? 1 : -1)
        }))
      } else {
        toast({
          title: t(_t('Error.')),
          description: result?.response?.data?.message,
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }

    return (
      <>
        <Box maxW="full" h="4em" overflow="hidden" p={1}>
          <Link
            title="Comments"
            to={`/chollo/${getUrlFromTitle(deal.title)}-${deal.id}`}
          >
            <Text
              lineHeight="1.3"
              css={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: 600,
                fontSize: "1.4em",
              }}
            >
              {deal.title}
            </Text>
          </Link>
        </Box>
        <Flex mt={2}>
          <Text
            colorScheme="blue"
            color={themeColor}
            bg={'blue.50'}
            h={'2.4em'}
            p={2}
            borderRadius={5}
            fontWeight={600}
          >
            <span>
              {
                (deal.type === 'free' || (deal.price_low < 0.001 && deal.type === 'deal')) ?
                  t(_t("FREE")) :
                  deal.type === 'deal' ? <span>{deal.price_low + "€ "}
                    <strike style={{ fontSize: '0.8em' }} >{deal.price_new}€</strike></span> :
                    deal.type === 'discount_percent' ?
                      <span>-{deal.price_new}%</span> :
                      <span>-{deal.price_new}€</span>
              }
            </span>
          </Text>
          <Spacer flex={0.2} />
          <Button
            as={'a'}
            href={deal.deal_url}
            target="_blank"
            rel="nofollow noopener"
            colorScheme="blue"
            display="flex"
            alignItems="center"
            w={"50%"}
            flex={1}
          >
            <ExternalLinkIcon mr={1} />
            {t(_t("Go to Sale"))}
          </Button>
        </Flex>
        <Flex alignItems="center" width={'100%'} mt={2}>
          <Flex alignItems="center">
            <Box _hover={{ color: themeColor }}>
              <Link title="Like" to="#">
                <FaThumbsUp
                  onClick={() => handleLike(true)}
                />
              </Link>
            </Box>
            <Spacer mx={'5px'} />
            <Box _hover={{ color: themeColor }}>
              <Link title="Dislike" to="#">
                <FaThumbsDown
                  onClick={() => handleLike(false)}
                />
              </Link>
            </Box>
            <Text
              p={2}
              borderRadius={5}
              fontWeight={600}
            >
              {deal?.cnt_like ?? 0}
            </Text>
          </Flex>
          <Spacer />
          {/* <Flex alignItems="center">
            {authToken?.user?.role === 'admin' &&
              (deal.vip ?
                <Box>
                  <Icon
                    // onClick={() => handleUnsetVip(deal.id)}
                    as={FaUser}
                    color="gray.500"
                    boxSize={5}
                    cursor={'pointer'}
                    title={t(_t('Unset VIP'))}
                  /></Box>
                :
                <Box>
                  <Icon
                    // onClick={() => handleSetVip(deal.id)}
                    as={FaCrown}
                    color="yellow.500"
                    boxSize={5}
                    cursor={'pointer'}
                    title={t(_t('Set VIP'))}
                  /></Box>
              )
            }
            {
              (authToken?.user?.role && (authToken.user.id === deal.user_id || authToken.user.role === 'admin')) &&
              <Box>
                <Icon
                  as={FaEdit}
                  color="blue.500"
                  boxSize={5}
                  ml={1}
                  cursor={'pointer'}
                  title={t(_t('edit'))}
                // onClick={async () => {
                //   setTimeout(() => {
                //     onEditOpen();
                //   }, 0);
                // }}
                />
              </Box>
            }
            {authToken?.user?.role === 'admin' &&
              <Box>
                <Icon
                  as={AiOutlineDelete}
                  color="red.500"
                  boxSize={5}
                  cursor={'pointer'}
                  title={t(_t('delete'))}
                // onClick={() => {
                //   setDeleteDealId(deal.id);
                //   onDeleteOpen();
                // }}
                />
              </Box>
            }
            {authToken?.user?.role === 'admin' && deal.status === 0 &&
              <Box>
                <Icon
                  // onClick={() => handleActivateDeal(deal.id)}
                  as={FaCheckCircle}
                  color="green.500"
                  boxSize={5}
                  cursor={'pointer'}
                  title={t(_t('activate'))}
                />
              </Box>
            }
            {(authToken?.user?.role === 'admin' && deal.pinned === 1) &&
              <Box>
                <Icon
                  // onClick={() => handleUnpinDeal(deal.id)}
                  as={FaStar}
                  color="green.500"
                  boxSize={5}
                  cursor={'pointer'}
                  title={t(_t('unpin'))}
                />
              </Box>
            }
            {(authToken?.user?.role === 'admin' && deal.pinned === 0) &&
              <Box>
                <Icon
                  // onClick={() => handlePinDeal(deal.id)}
                  as={FaRegStar}
                  color="green.500"
                  boxSize={5}
                  cursor={'pointer'}
                  title={t(_t('pin'))}
                />
              </Box>
            }
          </Flex>
          <Spacer /> */}
          <Flex alignItems={'center'}>
            <Box _hover={{ color: themeColor }}>
              <Link
                title="Comments"
                to={`/chollo/${getUrlFromTitle(deal.title)}-${deal.id}`}
              >
                <FaComment />
              </Link>
            </Box>
            <Spacer mx={'5px'} />
            <span>{deal.cnt_comment}</span>
          </Flex>
        </Flex>
      </>
    )
  }

  return (
    <Box maxW={'960px'} m={'auto'} p={2}>
      <Helmet>
        <title>{config?.site_title} - {store_name} {t(_t("discount codes"))}</title>
      </Helmet>
      <Breadcrumb
        separator=">"
        p={5}
        fontSize={'0.9em'}>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link} to="/"
            color={'blue.500'}
          >
            <Icon as={MdHome} boxSize={6} mt={1} />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            to={"/stores/"}
          >
            {t(_t("shop"))}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>
            {store?.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex>
        <Flex
          bg={'white'}
          w={'100px'}
          h={'100px'}
          p={2}
          justifyContent={'center'}
          borderRadius={3}
          shadow={"1px 1px 3px rgba(0,0,0,0.3)"}
        >
          <Image
            src={store?.image}
            alt="image"
            m={'auto'}
            width={"auto"}
          />
        </Flex>
        <Box ml={5} flex={1}>
          <Heading fontSize={'1.5em'}>{store?.name} {t(_t("discount code"))}</Heading>
          <Text>{t(_t("View the newest"))} {store?.name} {t(_t("discount codes in"))} {month} {currentDate.getFullYear()}</Text>
          <Box fontSize={'sm'}>
            <a href={`https://${store?.url}`} target={"_blank"} rel={"noopener noreferrer"} style={{ color: 'blue' }}>
              {store?.url}
            </a>
          </Box>
        </Box>
      </Flex>
      <Box>
        <Button
          as={'a'}
          to="#discount_codes"
          bg='white'
          _hover={{ bg: 'blue.500' }}
          size='sm'
          m={'20px 0 10px'}
        >
          {t(_t("discount codes"))}: {store?.cnt_discount ?? 0}
        </Button>
        <Button
          as={'a'}
          to="#deals"
          bg='white'
          _hover={{ bg: 'blue.500' }}
          size='sm'
          m={'20px 10px 10px'}
        >
          {t(_t("deals"))}: {store?.cnt_deal ?? 0}
        </Button>
      </Box>
      <Box id="discount_codes" m={'50px 0 10px'}>
        <Text fontSize={'1.2em'} fontWeight={600} m={'20px 0'}>
          {store?.name + ' ' + t(_t("discount codes")) + ' (' + (store?.cnt_discount ?? 0) + ')'}
        </Text>
        <Box>
          {deals &&
            deals?.filter(v => (v.type !== "deal")).map((discount) => {
              return (
                <Flex
                  key={discount.id}
                  bg={'white'}
                  p={2}
                  mb={'10px'}
                  borderRadius={3}
                  shadow={"1px 1px 3px rgba(0,0,0,0.3)"}
                >
                  <VStack p={'10px 20px'} justifyContent={'center'}>
                    <Text
                      fontSize={'1.5em'}
                      fontWeight={600}
                      color={(discount.expires && new Date(discount.expires) < currentDate) ? "gray.400" : "green.500"}
                    >
                      {Math.floor(discount.price_new)}%
                    </Text>
                    <Text fontWeight={600} color={'gray.400'} letterSpacing={'-1px'}>
                      {t(_t("DISCOUNT"))}
                    </Text>
                  </VStack>
                  <VStack p={'10px'} flex={1}>
                    {
                      (discount.expires && new Date(discount.expires) < new Date()) ?
                        <Text fontSize={'0.8em'} color={'gray.400'}>{t(_t("DISCOUNT EXPIRED"))}</Text> : null
                    }
                    <Text fontWeight={600}>{t(_t("Get"))} {Math.floor(discount.price_new)}% {t(_t("off orders at"))} {store?.name}</Text>
                    <Text fontSize={'0.8em'} color={'gray.400'}>{discount.count_of_used} {t(_t("USED"))}</Text>
                  </VStack>
                  {/* <Spacer /> */}
                  <VStack p={'10px'} justifyContent={'center'}>
                    {appMode === 'lg' ? (
                      <Button
                        colorScheme="blue"
                        p={'0 100px'}
                        onClick={() => handleClick(discount)}
                      >
                        {t(_t("Show code"))}
                      </Button>
                    ) : (
                      <Button
                        colorScheme="blue"
                        borderRadius={'50%'}
                        w={'40px'}
                        h={'40px'}
                        onClick={() => handleClick(discount)}
                      >
                        <ChevronRightIcon boxSize={6} />
                      </Button>
                    )}
                  </VStack>
                </Flex>
              )
            })
          }
        </Box>
        <Modal isOpen={isOpen} onClose={() => { setIsOpen(false) }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedDiscount?.storename} {t(_t("discount code"))}</ModalHeader>
            <ModalCloseButton />
            <ModalBody textAlign={'center'}>
              {(selectedDiscount?.type === 'free') ? (
                <Text fontWeight={600} p={5}>
                  Free {selectedDiscount?.storename} {t(_t("discount code"))}
                </Text>
              ) : (
                <Text fontWeight={600} p={5}>
                  {t(_t("Save"))} {selectedDiscount?.price_new}% {t(_t("on your next order"))}
                </Text>
              )}
              <Text p={2}>{t(_t("Don't forget to apply the code at checkout"))}</Text>
              <Box alignItems={'center'} justifyContent={'center'}>
                <Text
                  p={'6px 20px'}
                  color={'blue.500'}
                  border={'dashed 2px'}
                  borderColor={'blue.500'}
                  borderBottom={0}
                >
                  {selectedDiscount?.code}
                </Text>
                <Button
                  as={'a'}
                  href={selectedDiscount?.deal_url}
                  target="_blank"
                  rel="nofollow noopener"
                  w={'100%'}
                  colorScheme="blue"
                  alignItems="center"
                  borderRadius={1}
                >
                  <ExternalLinkIcon mr={1} />
                  {t(_t("Get code"))}
                </Button>
              </Box>
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
      </Box>
      <Box id="deals" m={'50px 0 10px'}>
        <Text fontSize={'1.2em'} fontWeight={600} m={'20px 0'}>
          {store?.name + ' ' + t(_t("deals")) + ' (' + (store?.cnt_deal ?? 0) + ')'}
        </Text>
        <Box>
          {deals?.length > 0 &&
            deals?.filter(v => (v.type === "deal")).map((deal, index) => {
              return (
                <Box
                  key={index}
                  bg={'white'}
                  p={3}
                  mb={'10px'}
                  borderRadius={3}
                  shadow={"1px 1px 3px rgba(0,0,0,0.3)"}
                  alignItems={'center'}
                  position={'relative'}
                >
                  <Box ml={-3} zIndex={2} position={'absolute'}>
                    {deal.cntLike > 1 &&
                      <Badge
                        colorScheme="pink"
                        color={'red'}
                        position={'absolute'}
                      >
                        {t(_t("HOT"))}
                      </Badge>
                    }
                    {deal.vip > 0 &&
                      <Badge
                        colorScheme="green"
                        color={'green'}
                        position={'absolute'}
                      >
                        {t(_t("VIP"))}
                      </Badge>
                    }
                    {new Date(deal.expires) < new Date() &&
                      <Badge
                        colorScheme="gray"
                        color={'gray'}
                        position={'absolute'}
                      >
                        {t(_t("Expired"))}
                      </Badge>
                    }
                    {!deal.status &&
                      <Badge
                        colorScheme="pink"
                        color={'orange'}
                        position={'absolute'}
                      >
                        {t(_t("Pending"))}
                      </Badge>
                    }
                  </Box>
                  {appMode === 'lg' ?
                    <Flex>
                      <Box flex='0.3'>
                        <Link
                          title="Comments"
                          to={`/chollo/${getUrlFromTitle(deal.title)}-${deal.id}`}
                        >
                          <Carousel images={JSON.parse(deal.image_urls)} m={'auto'} />
                        </Link>
                      </Box>
                      <Box flex='0.7' ml={5}>
                        <Flex color={"gray.400"} fontSize={'0.8em'} mb={3}>
                          <Flex alignItems="center">
                            <Avatar
                              src={deal.avatar}
                              name={deal.username}
                              size={'xs'}
                              mr={2}
                            />
                            <Text>{deal.username}</Text>
                          </Flex>
                          <Spacer />
                          <Flex alignItems={'center'}>
                            <TimeIcon />
                            <Text ml={1}><GetTimeDiff date={deal.start_date} /></Text>
                          </Flex>
                        </Flex>
                        <DealHeader deal={deal} setDeals={setDeals} deals={deals} />
                      </Box>
                    </Flex>
                    :
                    <>
                      <Carousel images={JSON.parse(deal.image_urls)} m={'auto'} />
                      <Spacer h={'10px'} />
                      <DealHeader deal={deal} setDeals={setDeals} deals={deals} />
                    </>
                  }
                </Box>
              )
            })
          }
        </Box>
      </Box>
    </Box>
  )
}

export default Store;
