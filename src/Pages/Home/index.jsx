import React, { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../../Components/GlobalContext";
import DoubleTopBar from "../../Layouts/CategoryBar";
import MyBreadcrumb from "../../Layouts/BreadCrumb";
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import CustomCard from "../../Components/Cards";
import Banner from "../../Components/Banner";
import { Spinner, useBreakpointValue } from "@chakra-ui/react";
import PopularCategories from "../../Components/PopularCategories";
import PopularShops from "../../Components/PopularShops";
import { getDealByFilter, } from "../../Services/Deal";
import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';
import { _t } from "../../Utils/_t";

let isScrolled = false;
let offset = 0;
let isend = false;

const Home = () => {
  const { t } = useTranslation();
  const { globalProps } = useContext(GlobalContext);
  const { categories, config } = globalProps;
  const [deals, setDeals] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [feature, setFeature] = useState("new")
  const appMode = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });
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
      feature: localStorage.getItem("feature")
    });

    if (data) {

      if (data.length !== limit) {
        isend = true;
      }

      loadmore ? setDeals((prevDeals) => [...prevDeals, ...data]) : setDeals(data);
      offset += limit;
    }

    setIsloading(false);
    // setTimeout(() => {
    !isend && (isScrolled = false);
    // }, 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDeals(false);
    };

    fetchData();
  }, [feature]);

  // useEffect(() => {
  //   if (!isScrolled) return;
  //   const fetchData = async () => {
  //     await getDeals();
  //   };

  //   fetchData();
  // }, [isScrolled]);

  const handleScroll = () => {

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;

    if (scrollPosition + 1000 >= documentHeight) {

      if (isScrolled) return;
      isScrolled = true;
      getDeals();
    }
    window.removeEventListener("scroll", () => { });
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    localStorage.setItem("feature", "new");
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  return (
    <div>
      <Helmet>
        <title>{config?.site_title} - {feature} {t(_t("deals"))} </title>
      </Helmet>
      <DoubleTopBar categories={categories} setFeature={setFeature} />
      <Box maxW={'1200px'} m={'auto'}>
        <MyBreadcrumb />
        <Box id="Home">
          <Flex>
            <Box flex={1}>
              <SimpleGrid
                columns={[1, 2, 3, 4]}
                spacingX={2}
                spacingY={5}
                m={'0 10px 20px'}
                position={'relative'}
              >
                {isloading &&
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                    position="fixed"
                    top="50%"
                    left="calc(40%)"
                    transform="translate(-50%, -50%)"
                    opacity={1}
                    zIndex={1}
                  />
                }
                {deals && deals.map((deal) => (
                  <Box key={deal.id} opacity={isloading ? 0.3 : 1}>
                    <CustomCard deal={deal} />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
            {appMode === 'lg' &&
              <Box
                width={'20%'}
              >
                <Banner />
                <PopularShops />
                <PopularCategories />
              </Box>
            }
          </Flex>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
