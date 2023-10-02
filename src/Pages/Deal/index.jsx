import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { GlobalContext } from "../../Components/GlobalContext";
import MyBreadcrumb from "../../Layouts/BreadCrumb";
import {
  Box,
  Flex,
  Button,
  ButtonGroup,
  Badge,
  Avatar,
  Text,
  useBreakpointValue,
  Spacer,
  Divider,
  // Menu,
  // MenuButton,
  // MenuList,
  // MenuItem,
  useToast,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import Carousel from "../../Components/Carousel"
import { Helmet } from "react-helmet";
import { FaThumbsUp, FaThumbsDown, FaComment, FaUser, FaCrown, FaEdit, FaStar, FaRegStar, FaEye, FaEyeSlash } from "react-icons/fa";
import { ExternalLinkIcon, TimeIcon, InfoIcon } from "@chakra-ui/icons";
import PopularCategories from "../../Components/PopularCategories";
import PopularShops from "../../Components/PopularShops";
import { activateDealService, deactivateDealService, deleteDealService, getDealByIdService, setPinService, setUnpinService, setVipService, unsetVipService } from "../../Services/Deal";
import { GetTimeDiff, isMoreThanAMonth } from "../../Helpers";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './index.css'
import { addLikeDealService } from "../../Services/Like";
import { useTranslation } from "react-i18next";
import { _t } from "../../Utils/_t";
import { createCommentService, deleteCommentService, getCommentsByDealIdService } from "../../Services/Comment";
import { AiOutlineDelete } from "react-icons/ai";
import CreateOrUpdateDeal from "../Create/deal";
import CreateOrUpdateDiscount from "../Create/discount";

const Deal = () => {
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { t } = useTranslation();
  const { globalProps } = useContext(GlobalContext);
  const { categories, config } = globalProps;
  const { dealTitle } = useParams();
  const [deal, setDeal] = useState({});
  const [images, setImages] = useState([]);
  const toast = useToast();
  const [newComment, setNewComment] = useState(null);
  const [comments, setComments] = useState([]);
  const [deleteDealId, setDeleteDealId] = useState(-1)
  const [isDeletingDeal, setDeletingDeal] = useState(true)
  const [deleteCommentId, setDeleteCommentId] = useState(-1)
  const history = useHistory();

  const appMode = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });
  const themeColor = 'blue.500';

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['link'],
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
    'align',
    'list',
    'ordered',
    'bullet',
    'color',
    'background',
    'clean',
  ];

  const getDealIdFromParams = (dealTitle) => {
    const splitTitle = dealTitle.split('-');
    return splitTitle[splitTitle.length - 1];
  }

  const getDealById = async (dealId) => {
    const data = await getDealByIdService(dealId);
    return data;
  };

  const getCommentsByDealId = async (dealId) => {
    const data = await getCommentsByDealIdService(dealId);
    return data;
  }

  useEffect(() => {
    const fetchData = async () => {
      const dealId = getDealIdFromParams(dealTitle);
      const [_deal, _comments] = await Promise.all([
        getDealById(dealId),
        getCommentsByDealId(dealId),
      ]);

      if (!_deal?.id > 0) {
        history.push('/404');
        return;
      }

      setDeal(_deal);
      setComments(_comments);
      _deal?.image_urls && setImages(JSON.parse(_deal.image_urls));
    }

    fetchData();
  }, [dealTitle]);

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
      setDeal({ ...deal, cnt_like: deal.cnt_like + (isLike ? 1 : -1) })
      toast({
        title: t(_t('Success.')),
        description: t(_t('Thank you for your feedback.')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
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

  const handleChangeComment = (content) => {
    setNewComment(content);
  }

  const handleAddComment = async () => {
    setNewComment("");
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

    const div = document.createElement('div');
    div.innerHTML = newComment;
    const hasText = div.textContent.trim().length > 0;

    if (!hasText) {
      toast({
        title: t(_t('Warning.')),
        description: t(_t('Empty Comment!')),
        position: 'top',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    const result = await createCommentService({
      blog: newComment,
      dealId: deal.id
    })

    if (result) {
      setComments([
        result,
        ...comments
      ])
      setDeal({
        ...deal,
        cnt_comment: deal.cnt_comment + 1
      })
    } else {
      toast({
        title: t(_t('Warning.')),
        description: t(_t('Please login.')),
        position: 'top',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const handleCommentLike = async (commentId, isLike) => {
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
      type: "comment",
      dest_id: commentId,
      is_like: isLike
    });
    if (result.status === 200) {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          comment.cnt_like = comment.cnt_like + (isLike ? 1 : -1);
        }
        return comment;
      }))
      toast({
        title: t(_t('Success.')),
        description: t(_t('Thank you for your feedback.')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
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

  const authToken = JSON.parse(localStorage.getItem("authToken"))

  const deleteDeal = async (deleteDealId) => {
    var response = await deleteDealService(deleteDealId)
    if (response.status === 200) {
      toast({
        title: t(_t('Success.')),
        description: t(_t('Deleting deal success')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      history.goBack()
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

  const handleSetVip = async (id) => {
    var response = await setVipService(id)
    if (response.status === 200) {
      toast({
        title: t(_t('Success.')),
        description: t(_t('Setting VIP success')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setDeal({
        ...deal,
        vip: 1
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

  const handleUnsetVip = async (id) => {
    var response = await unsetVipService(id)
    if (response.status === 200) {
      toast({
        title: t(_t('Success.')),
        description: t(_t('Unsetting VIP success')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setDeal({
        ...deal,
        vip: 0
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

  const handleActivateDeal = async (dealId) => {
    var response = await activateDealService(dealId)
    if (response.status === 200) {
      toast({
        title: t(_t('Success.')),
        description: t(_t('Activating deal success')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setDeal({
        ...deal,
        status: 1
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

  const handleDeactivateDeal = async (dealId) => {
    var response = await deactivateDealService(dealId)
    if (response.status === 200) {
      toast({
        title: t(_t('Success.')),
        description: t(_t('Deactivating deal success')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setDeal({
        ...deal,
        status: 0
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

  const handleUpdateDeal = async (_deal) => {
    if (authToken?.user?.role !== 'admin')
      _deal.status = 0
    setDeal({
      ...deal,
      ..._deal
    })
  }

  const deleteComment = async (id) => {
    var response = await deleteCommentService(id)
    if (response.status === 200) {
      toast({
        title: t(_t('Success.')),
        description: t(_t('Deleting comment success')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setDeal({
        ...deal,
        cnt_comment: deal.cnt_comment - 1
      })
      setComments(comments.filter(comment => comment.id !== id))
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

  const handlePinDeal = async (id) => {
    var response = await setPinService(id)
    if (response.status === 200) {
      toast({
        title: t(_t('Success.')),
        description: t(_t('Successfully pinned')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setDeal({
        ...deal,
        pinned: 1
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

  const handleUnpinDeal = async (id) => {
    var response = await setUnpinService(id)
    if (response.status === 200) {
      toast({
        title: t(_t('Success.')),
        description: t(_t('Successfully unpinned')),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setDeal({
        ...deal,
        pinned: 0
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

  const DealHeader = () => {
    return (
      <>
        <Helmet>
          <title>{config?.site_title + " - " + deal.title}</title>
        </Helmet>
        <Box
          color={themeColor}
          _hover={{ color: 'gray.800' }}
          fontSize={'0.8em'}
          p={1}
        >
          <Link to={"/store/" + deal.storename}>
            {deal.storename} {t(_t("discount code"))}
          </Link>
        </Box>
        <Box maxW="full" h="4em" overflow="hidden" p={1}>
          <Text
            lineHeight="1.3"
            css={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: 600,
              fontSize: "1.5em",
            }}
          >
            {deal.title}
          </Text>
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
            {t(_t("Go to"))} {deal.storename}
          </Button>
        </Flex>
        <Flex alignItems="center" width={'100%'} mt={2}>
          <Flex alignItems="center">
            <Text
              p={2}
              bg={deal.cnt_like > 1 ? 'red.500' : 'orange'}
              color={'white'}
              borderRadius={5}
              fontWeight={600}
            >
              {t(_t("Score"))}: {deal.cnt_like ?? 0}
            </Text>
            <Spacer mx={'5px'} />
            <Box _hover={{ color: themeColor }}>
              <Link title="Like" to="#">
                <FaThumbsUp onClick={() => handleLike(true)} />
              </Link>
            </Box>
            <Spacer mx={'5px'} />
            <Box _hover={{ color: themeColor }}>
              <Link title="Dislike" to="#">
                <FaThumbsDown onClick={() => handleLike(false)} />
              </Link>
            </Box>
          </Flex>
          <Spacer />
          <Flex alignItems="center">
            {authToken?.user?.role === 'admin' &&
              (deal.vip ?
                <Box>
                  <Icon
                    onClick={() => handleUnsetVip(deal.id)}
                    as={FaUser}
                    color="gray.500"
                    boxSize={5}
                    cursor={'pointer'}
                    title={t(_t('Unset VIP'))}
                  /></Box>
                :
                <Box>
                  <Icon
                    onClick={() => handleSetVip(deal.id)}
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
                  onClick={async () => {
                    setTimeout(() => {
                      onEditOpen();
                    }, 0);
                  }}
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
                  onClick={() => {
                    setDeleteDealId(deal.id);
                    onDeleteOpen();
                  }}
                />
              </Box>
            }
            {authToken?.user?.role === 'admin' && deal.status === 0 &&
              <Box>
                <Icon
                  onClick={() => handleActivateDeal(deal.id)}
                  as={FaEye}
                  color="blue.500"
                  boxSize={5}
                  cursor={'pointer'}
                  title={t(_t('activate'))}
                />
              </Box>
            }
            {authToken?.user?.role === 'admin' && deal.status === 1 &&
              <Box>
                <Icon
                  onClick={() => handleDeactivateDeal(deal.id)}
                  as={FaEyeSlash}
                  color="blue.500"
                  boxSize={5}
                  cursor={'pointer'}
                  title={t(_t('deactivate'))}
                />
              </Box>
            }
            {(authToken?.user?.role === 'admin' && deal.pinned === 1) &&
              <Box>
                <Icon
                  onClick={() => handleUnpinDeal(deal.id)}
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
                  onClick={() => handlePinDeal(deal.id)}
                  as={FaRegStar}
                  color="green.500"
                  boxSize={5}
                  cursor={'pointer'}
                  title={t(_t('pin'))}
                />
              </Box>
            }
          </Flex>
          <Spacer />
          <Flex alignItems={'center'}>
            <Box _hover={{ color: themeColor }}>
              <a title="Comments" href="#add_comment">
                <FaComment />
              </a>
            </Box>
            <Spacer mx={'5px'} />
            <span>{deal.cnt_comment}</span>
          </Flex>
        </Flex>
      </>
    )
  }

  const Comment = ({ comment, children }) => {
    useEffect(() => {
    }, [])
    return (
      <Box className="parent_comments" mt={10}>
        <Flex color={"gray.400"} fontSize={'0.8em'} my={2} alignItems={'center'}>
          <Avatar
            src={comment.avatar}
            name={comment.username}
            size={'xs'}
            mr={2}
          />
          <Text>{comment.username}</Text>
          <Spacer />
          <TimeIcon />
          <Text ml={1}><GetTimeDiff date={comment.start_date} /></Text>
        </Flex>
        <Box>
          <Text
            bg={'gray.100'}
            p={'15px'}
            borderRadius={10}
            shadow={'0 2px 2px rgba(0,0,0,.18), 0 0 0 rgba(0,0,0,.18)'}
            dangerouslySetInnerHTML={{ __html: comment.description }}
          >

          </Text>
          <Flex m={'10px'} color={'gray.500'} alignItems={'center'}>
            <Link title="Like" to="#" onClick={() => handleCommentLike(comment.id, true)}>
              <Flex mr={2} _hover={{ color: themeColor }}>
                <FaThumbsUp />
              </Flex>
            </Link>
            <Link title="Like" to="#" onClick={() => handleCommentLike(comment.id, false)}>
              <Flex mr={2} _hover={{ color: themeColor }}>
                <FaThumbsDown />
              </Flex>
            </Link>
            <Text>{comment.cnt_like ?? 0}</Text>
            <Spacer />
            {
              authToken?.user?.role === "admin" &&
              <Box>
                <Icon
                  as={AiOutlineDelete}
                  color="red.500"
                  boxSize={5}
                  cursor={'pointer'}
                  title={t(_t('delete'))}
                  onClick={() => {
                    setDeleteCommentId(comment.id)
                    setDeletingDeal(false)
                    onDeleteOpen(true)
                  }}
                />
              </Box>
            }
            {/* <Flex _hover={{ color: themeColor }} ml={5}>
                <Link title="Reply" to="#" onClick={() => setIsOpen(!isOpen)}>
                  <Flex mr={2}>
                    <Text mr={1}>Reply</Text>
                    <FaReply />
                  </Flex>
                </Link>
              </Flex> */}
          </Flex>
          {/* {isOpen &&
              <CommentEditor />
            } */}
        </Box>
        <Box className="child_comments" ml={'20px'}>
          {children}
        </Box>
      </Box>
    )
  }

  return (
    deal.id > 0 &&
    <>
      {isMoreThanAMonth(deal.start_date) &&
        <Box bg={'yellow.100'}>
          <Text maxW={'1200px'} m={'auto'} p={5}>
            <InfoIcon boxSize={4} mr={2} mt={'-1px'} color={'blue.500'} />
            {t(_t("This deal was posted over a month ago and may no longer be available."))}
          </Text>
        </Box>
      }
      <Box maxW={'1200px'} m={'auto'}>
        <MyBreadcrumb categories={categories} categorySlug={deal?.category_slug} />
        <Box
          id="Home"
          maxW={'960px'}
          m={'auto'}
        >
          <Box
            bg={'white'}
            borderWidth="1px"
            rounded="lg"
            shadow="1px 1px 3px rgba(0,0,0,0.3)"
            p={6}
            mb={'10px'}
          >
            {/* <Flex>
              <Spacer />
              <Menu>
                <MenuButton
                  size="sm"
                  ml={2}
                  fontSize={'2em'}
                  h={5}
                >
                  <Flex>
                    <Box w="5px" h="5px" borderRadius="50%" bg="black" mr={'2px'} />
                    <Box w="5px" h="5px" borderRadius="50%" bg="black" mr={'2px'} />
                    <Box w="5px" h="5px" borderRadius="50%" bg="black" mr={'2px'} />
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={''} >{t(_t("Expired"))}</MenuItem>
                </MenuList>
              </Menu>
            </Flex> */}
            <Box ml={-6} position={'absolute'} zIndex={2}>
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
                <Box flex='0.4'>
                  <Carousel images={images} m={'auto'} />
                </Box>
                <Box flex='0.6' ml={5}>
                  <DealHeader />
                </Box>
              </Flex>
              :
              <>
                <Carousel images={images} m={'auto'} />
                <Spacer h={'10px'} />
                <DealHeader />
              </>
            }
            {deal.info_html &&
              <Box p={5} mt={5} bg={'gray.100'}>
                <InfoIcon boxSize={4} mr={2} mt={'-1px'} color={'blue.500'} />
                <Text as={'span'} fontWeight={600}>{deal.storename + " " + t(_t('information'))}</Text>
                <Text className="rich_description" mt={3} dangerouslySetInnerHTML={{ __html: deal.info_html }} />
              </Box>
            }
            <Divider m={'20px 0'} />
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
            <Text className="rich_description" dangerouslySetInnerHTML={{ __html: deal.description }} />
            <Spacer id="add_comment" h={'50px'} />
            <Flex
              bg={themeColor}
              color={'white'}
              p={'8px'}
              m={'10px 0'}
              borderRadius={5}
            >
              <Box m={'4px 5px 0'}>
                <FaComment />
              </Box>
              <Text>{t(_t("What do you think of this"))} {deal.storename} {t(_t("deal"))}?</Text>
            </Flex>
            <Box className="comment_editor">
              <ReactQuill
                name="comment_quill"
                theme="snow"
                modules={modules}
                formats={formats}
                readOnly={localStorage.getItem('authToken') ? false : true}
                value={newComment}
                onChange={(content) => handleChangeComment(content)}
              />
              <ButtonGroup>
                <Button mt={2} colorScheme="blue" onClick={handleAddComment}>
                  {t(_t("Comment"))}
                </Button>
                <Button mt={2} ml={2} colorScheme="gray" onClick={() => { setNewComment(null) }}>
                  {t(_t("Cancel"))}
                </Button>
              </ButtonGroup>
            </Box>
            <Box id="comments_container">
              {comments.length > 0 ?
                comments.map((comment) => {
                  return <Comment key={comment.id} comment={comment} />
                })
                :
                <Box p={5} bg={'gray.100'} mt={6} borderRadius={5} fontWeight={600} textAlign={'center'}>
                  {t(_t("No comments yet"))}
                </Box>
              }
            </Box>
          </Box>
          <Box>
            <PopularShops />
            <PopularCategories />
          </Box>
        </Box>
      </Box>
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t(_t("Delete Deal"))}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {t(_t("Are you sure?"))}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              {t(_t("Cancel"))}
            </Button>
            <Button colorScheme="red" onClick={() => {
              if (isDeletingDeal)
                deleteDeal(deleteDealId);
              else
                deleteComment(deleteCommentId)
              onDeleteClose();
            }}>
              {t(_t("Delete"))}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEditOpen} onClose={onEditClose} closeOnOverlayClick={false} size={'4xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t(_t("Edit Deal"))}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deal.type === 'deal' ?
              <CreateOrUpdateDeal deal={deal} onClose={onEditClose} onUpdate={handleUpdateDeal} />
              : <CreateOrUpdateDiscount discount={deal} onClose={onEditClose} onUpdate={handleUpdateDeal} />
            }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Deal;
