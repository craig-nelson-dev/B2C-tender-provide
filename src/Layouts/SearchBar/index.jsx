import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  InputGroup,
  InputRightElement,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  SimpleGrid,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { _t } from "../../Utils/_t";
import { getDealByFilter } from "../../Services/Deal";

export default function SearchBar({ appMode }) {
  const { t } = useTranslation()
  const searchMode = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });
  const themeColor = "blue.500";
  const [deals, setDeals] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [keyword, setKeyword] = useState('');

  const getDeals = async () => {
    var filter = {
      start_at: 0,
      length: 100,
    }
    if (keyword.length > 0)
      filter.search = keyword;
    const data = await getDealByFilter({
      ...filter
    });
    setDeals(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDeals();
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    setIsloading(true);
    await getDeals();
    setIsloading(false);
  }

  const getUrlFromTitle = (title) => {
    const _title = title.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
    if (_title.length > 30) {
      return _title.slice(0, 30) + "...";
    }
    return _title;
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {searchMode === 'lg' ? (
        <InputGroup
          bg={'white'}
          maxW={'300px'}
          borderRadius={'5px'}
          ml={'10px'}
          display={{ base: 'none', md: 'block' }}
          onClick={() => { setIsOpen(!isOpen) }}
        >
          <Input placeholder={t(_t("Search Deals")) + "..."} />
          <InputRightElement children={<SearchIcon />} />
        </InputGroup>
      ) : (
        <Button
          className="btnRes"
          border={`solid white 2px`}
          bg={themeColor}
          color={'white'}
          _hover={{
            color: themeColor,
            bg: 'white',
          }}
          onClick={() => { setIsOpen(!isOpen) }}
        >
          <SearchIcon />
        </Button>
      )}
      <Drawer
        isOpen={isOpen}
        placement={"top"}
        onClose={() => { setIsOpen(false) }}
      >
        <DrawerContent
          bg={'gray.100'}
          minW={"100vw"}
        >
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            <Box maxW={'1200px'} m={'auto'}>
              <InputGroup
                bg={'white'}
                borderRadius={'5px'}
                ml={'10px'}
                onClick={() => { }}
              >
                <Input
                  placeholder={t(_t("Search Deals")) + "..."}
                  onChange={(e) => { setKeyword(e.target.value) }}
                  value={keyword}
                  onKeyDown={handleKeyPress}
                />
                <InputRightElement
                  w={appMode === 'lg' ? '100px' : '40px'}
                  children={
                    appMode === 'lg' ?
                      <Button
                        isLoading={isloading}
                        w={'100px'}
                        colorScheme="blue"
                        onClick={handleSearch}
                      >
                        {t(_t("Search"))}
                      </Button>
                      :
                      isloading ? <Button isLoading={isloading} />
                        :
                        <SearchIcon onClick={handleSearch} />
                  } />
              </InputGroup>
              <Text m={5} fontSize={'1.2em'} fontWeight={600}>{t(_t("Deals"))}</Text>
              {deals?.length > 0 &&
                <SimpleGrid
                  flex={1}
                  columns={appMode === 'lg' ? 2 : 1}
                  spacingX={2}
                  spacingY={5}
                  m={'20px 10px 20px'}
                  position={'relative'}
                >
                  {deals && deals.map((deal) => (
                    <Link
                      key={deal.id}
                      to={`/chollo/${getUrlFromTitle(deal.title)}-${deal.id}`}
                      onClick={() => { setIsOpen(false) }}
                    >
                      <Flex fontSize={'0.9em'}>
                        <Text mx={1} color={'red'} fontWeight={600}>{deal.cnt_like ?? 0}</Text>
                        <Text mx={1} _hover={{ textDecoration: 'underline' }} >
                          {deal.title}
                          <span
                            style={{
                              marginLeft: '10px',
                              fontWeight: 600,
                              color: '#3182ce',
                            }}
                          >
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
                      </Flex>
                    </Link>
                  ))
                  }
                  {!deals && <Text p={5}>No Data</Text>}
                </SimpleGrid>
              }
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}