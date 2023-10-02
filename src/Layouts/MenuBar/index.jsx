import React, { useState, useContext } from "react";
import { GlobalContext } from "../../Components/GlobalContext";
import {
  Box,
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  IconButton,
  Divider,
  Text,
  Grid,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaMoneyBill, FaFolderOpen, FaCrown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { _t } from "../../Utils/_t";
import { useHistory } from 'react-router-dom';
import Logo from "../../Components/Logo";

function MenuBar({ appMode }) {
  const { globalProps } = useContext(GlobalContext);
  const { categories, stores, config } = globalProps;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };


  const handleVip = () => {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    if (!auth_token) {
      toast({
        title: t(_t('Error.')),
        description: t(_t("Please login.")),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } else if (auth_token.user.role === "customer") {
      toast({
        title: t(_t('Error.')),
        description: t(_t("You don't have a access to VIP")),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } else {
      setIsOpen(false);
      history.push('/vip');
    }
  }


  return (
    <Box>
      {appMode !== 'lg' ?
        <IconButton
          icon={<HamburgerIcon />}
          variant="outline"
          onClick={handleToggle}
          aria-label="Toggle Menu"
          size="md"
          border={0}
          color={'white'}
          _hover={{
            color: 'blue.500',
            bg: 'white',
          }}
        />
        :
        <Button
          variant="outline"
          onClick={handleToggle}
          aria-label="Toggle Menu"
          size="md"
          border={'2px'}
          color={'white'}
          _hover={{
            color: 'blue.500',
            bg: 'white',
          }}
        >
          {t(_t("Menu"))}
        </Button>
      }
      <Drawer
        isOpen={isOpen}
        placement={appMode === 'lg' ? "top" : "left"}
        onClose={handleToggle}
      >
        <DrawerContent
          color={appMode === 'lg' ? 'white' : 'blue.400'}
          bg={appMode === 'lg' ? 'blue.400' : 'white'}
          width={"min(100vw - (100vw - 100%), 1200px)"}
          minW={"min(100vw - (100vw - 100%), 1200px)"}
          marginX={'auto'}
          marginTop={appMode === 'lg' ? "54px" : "0px"}
        >
          <DrawerCloseButton color={'white'} />
          {appMode !== 'lg' &&
            <DrawerHeader bg={'blue.500'} h={'54px'} p={0}>
              <Box onClick={() => setIsOpen(false)}>
                <Logo />
              </Box>
            </DrawerHeader>
          }
          <DrawerBody>
            {appMode === 'lg' ?
              <Box maxW={'1200px'} m={'auto'}>
                <Flex>
                  <Box px={2} flex={1} borderRight={'1px'}>
                    <Flex p={'15px 0'}>
                      <FaFolderOpen style={{ marginTop: '5px' }} />
                      <Text fontWeight={600} ml={2}>{t(_t("Categories"))}</Text>
                    </Flex>
                    <Box p={2}>
                      {categories
                        ?.filter((category) => (category.status && config?.popular_categories?.indexOf(category.id) >= 0))
                        .map((category) => (
                          <Link to={"/categoria/" + category.slug} key={category.id}>
                            <Text
                              mr={2}
                              mb={2}
                              height={'2em'}
                              fontWeight={400}
                              onClick={() => setIsOpen(false)}
                            >
                              {category.name}
                            </Text>
                          </Link>
                        ))}
                      <Link to={"/categorias"}>
                        <Text
                          mr={2}
                          mb={2}
                          height={'2em'}
                          fontWeight={600}
                          onClick={() => setIsOpen(false)}
                        >
                          {t(_t("All Categories"))}
                          <ArrowForwardIcon />
                        </Text>
                      </Link>
                    </Box>
                  </Box>

                  <Box px={2} flex={1} borderRight={'1px'} pl={10}>
                    <Flex p={'15px 0'}>
                      <FaShoppingCart style={{ marginTop: '5px' }} />
                      <Text fontWeight={600} ml={2}>{t(_t("Shops"))}</Text>
                    </Flex>
                    <Box pt={2}>
                      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                        {stores
                          ?.filter(store => (store.status && config?.popular_shops?.indexOf(store.id) >= 0))
                          .map((store) => (
                            <Link to={`/store/${store.name}`} key={store.id}>
                              <Text
                                mr={2}
                                height={'2em'}
                                fontWeight={400}
                                onClick={() => setIsOpen(false)}
                              >
                                {store.name}
                              </Text>
                            </Link>
                          ))}
                      </Grid>
                      <Link to={"/stores"}>
                        <Text
                          mr={2}
                          mt={2}
                          height={'2em'}
                          fontWeight={600}
                          onClick={() => setIsOpen(false)}
                        >
                          {t(_t("All Shops"))}
                          <ArrowForwardIcon />
                        </Text>
                      </Link>
                    </Box>
                  </Box>

                  <Box px={2} flex={0.7} borderRight={'1px'} pl={10}>
                    <Link to="/gratis" onClick={() => setIsOpen(false)}>
                      <Flex p={'15px 0'} cursor={"pointer"}>
                        <FaMoneyBill style={{ marginTop: '5px' }} />
                        <Text fontWeight={600} ml={2} >{t(_t("Free"))}</Text>
                      </Flex>
                    </Link>
                  </Box>

                  <Box px={2} flex={0.7} pl={10} onClick={handleVip}>
                    {/* <Link to="/vip" onClick={() => setIsOpen(false)}> */}
                    <Flex p={'15px 0'} cursor={"pointer"}>
                      <FaCrown style={{ marginTop: '5px' }} />
                      <Text fontWeight={600} ml={2} >{t(_t("VIP"))}</Text>
                    </Flex>
                    {/* </Link> */}
                  </Box>
                </Flex>
              </Box>
              :
              <Box>
                <Link to="/gratis" onClick={() => setIsOpen(false)}>
                  <Flex p={'15px 0'}>
                    <FaMoneyBill style={{ marginTop: '5px' }} />
                    <Text fontWeight={600} fontSize={'1.1em'} ml={2}>{t(_t("Free"))}</Text>
                  </Flex>
                </Link>

                <Divider borderColor={'gray.500'} />

                {/* <Link to="/vip" onClick={() => setIsOpen(false)}> */}
                <Flex p={'15px 0'} onClick={handleVip}>
                  <FaCrown style={{ marginTop: '5px' }} />
                  <Text fontWeight={600} fontSize={'1.1em'} ml={2}>{t(_t("VIP"))}</Text>
                </Flex>
                {/* </Link> */}
                <Divider borderColor={'gray.500'} />

                <Flex p={'15px 0'}>
                  <FaFolderOpen style={{ marginTop: '5px' }} />
                  <Text fontWeight={600} fontSize={'1.1em'} ml={2}>{t(_t("Categories"))}</Text>
                </Flex>
                <Box p={2}>
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    {categories
                      ?.filter((category) => (category.status && config?.popular_categories?.indexOf(category.id) >= 0))
                      .map((category) => (
                        <Link to={"/categoria/" + category.slug} key={category.id}>
                          <Text
                            mr={2}
                            mb={2}
                            height={'2em'}
                            fontWeight={400}
                            onClick={() => setIsOpen(false)}
                          >
                            {category.name}
                          </Text>
                        </Link>
                      ))}
                  </Grid>
                  <Link to={"/categorias"}>
                    <Text
                      mr={2}
                      mb={2}
                      height={'2em'}
                      fontWeight={600}
                      onClick={() => setIsOpen(false)}
                    >
                      {t(_t("All Categories"))}
                      <ArrowForwardIcon />
                    </Text>
                  </Link>
                </Box>

                <Divider borderColor={'gray.500'} />

                <Flex p={'15px 0'}>
                  <FaShoppingCart style={{ marginTop: '5px' }} />
                  <Text fontWeight={600} fontSize={'1.1em'} ml={2}>{t(_t("Shops"))}</Text>
                </Flex>
                <Box pt={2}>
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    {stores
                      ?.filter(store => (store.status && config?.popular_shops?.indexOf(store.id) >= 0))
                      .slice(0, 10).map((store) => (
                        <Link to={`/store/${store.name}`} key={store.id}>
                          <Text
                            mr={2}
                            mb={2}
                            height={'2em'}
                            fontWeight={400}
                            onClick={() => setIsOpen(false)}
                          >
                            {store.name}
                          </Text>
                        </Link>
                      ))}
                  </Grid>
                  <Link to={"/stores"}>
                    <Text
                      mr={2}
                      mb={2}
                      height={'2em'}
                      fontWeight={600}
                      onClick={() => setIsOpen(false)}
                    >
                      {t(_t("All Shops"))}
                      <ArrowForwardIcon />
                    </Text>
                  </Link>
                </Box>
              </Box>
            }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
export default MenuBar;