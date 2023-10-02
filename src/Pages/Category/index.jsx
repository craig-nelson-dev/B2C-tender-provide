import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../Components/GlobalContext";
import { useParams, useHistory } from 'react-router-dom';
import MyBreadcrumb from "../../Layouts/BreadCrumb";
import CategoryBar from "../../Layouts/CategoryBar/categories";
import { Box, Flex, SimpleGrid, useBreakpointValue, Spinner } from "@chakra-ui/react";
import CustomCard from "../../Components/Cards";
import TreeViewCategories from "../../Components/TreeViewCategories";
import { getDealByFilter } from "../../Services/Deal";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { _t } from "../../Utils/_t";

let isScrolled = false;
let offset = 0;
let isend = false;

const Category = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { globalProps } = useContext(GlobalContext);
  const { categories, config } = globalProps;
  const { categorySlug } = useParams();
  const [deals, setDeals] = useState([]);
  const [isloading, setIsloading] = useState(false);

  const appMode = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });

  const [catIds, setCatIds] = useState([]);
  const limit = 24;

  const getDeals = async (loadmore = true) => {

    if (!loadmore) {
      offset = 0;
      isend = false;
      setDeals([]);
      setIsloading(true);
    }

    const data = await getDealByFilter({
      start_at: offset,
      length: limit,
      category_id: JSON.parse(localStorage.getItem("category"))
    });

    if (data) {

      if (data.length !== limit) {
        isend = true;
      }

      loadmore ? setDeals((prevDeals) => [...prevDeals, ...data]) : setDeals(data);
      offset += limit;
      // console.log(data[0], offset)
    }

    setIsloading(false);
    !isend && (isScrolled = false);
  };

  useEffect(() => {
    if (!catIds.length) return;
    const fetchData = async () => {
      await getDeals(false);
    };

    fetchData();
  }, [catIds])

  const handleScroll = () => {

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;

    if (scrollPosition + 1000 >= documentHeight) {

      if (isScrolled)
        return;
      isScrolled = true;

      getDeals();
    }

    window.removeEventListener("scroll", () => { });
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  return (
    <>
      <Helmet>
        <title>{config?.site_title} - {categorySlug} {t(_t("deals"))}</title>
      </Helmet>
      <Box
        shadow={'0 3px 3px rgba(0,0,0,.15), 0 0 0 rgba(0,0,0,.15)'}
      >
        <CategoryBar categories={categories} categorySlug={categorySlug} />
      </Box>
      <Box maxW={'1200px'} m={'auto'}>
        <MyBreadcrumb categories={categories} categorySlug={categorySlug} />
        <Box id="Home">
          <Flex>
            <Box
              width={appMode === 'lg' ? '20%' : '0px'}
            >
              <TreeViewCategories
                _categories={categories}
                categorySlug={categorySlug}
                filterDeals={setCatIds}
              />
            </Box>
            <SimpleGrid
              flex={1}
              columns={[1, 2, 3, 4]}
              spacingX={2}
              spacingY={5}
              m={'0 10px 20px'}
              position={'relative'}
              minW={'calc(80% - 20px)'}
            >
              {isloading &&
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                  position="absolute"
                  top="200px"
                  left="calc(50% - 20px)"
                  transform="translate(-50%, -50%)"
                  zIndex={1}
                />
              }
              {deals && deals.map((deal) => (
                <Box key={deal?.id} opacity={isloading ? 0.3 : 1}>
                  <CustomCard deal={deal} />
                </Box>
              ))}
            </SimpleGrid>
          </Flex>
          {/* {deals.length > 0 && !isend &&
            <Center w={'100%'} p={5} colSpan={[1, 2, 3, 4]}>
              <Button
                colorScheme="blue"
                onClick={getDeals}
              >
                {t(_t("Load more"))}
              </Button>
            </Center>
          } */}
        </Box>
      </Box>
    </>
  );
};

export default Category;
