import { Divider, Text, Button, Box } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { _t } from "../../Utils/_t";
import { useContext } from "react";
import { GlobalContext } from "../GlobalContext";

const PopularCategories = () => {
  const { globalProps } = useContext(GlobalContext)
  const { categories, config } = globalProps
  const { t } = useTranslation()
  const themeColor = 'blue.500';
  const currentDate = new Date();
  const month = currentDate.toLocaleString('en-US', { month: 'long' });

  return (
    <Box p={2}>
      <Text fontWeight={600}>{t(_t("Popular categories"))}</Text>
      <Divider m={'5px 0 10px'} borderColor={'gray.500'} />
      <Text fontSize={'0.9em'}>
        {t(_t("Working discounts, coupons for"))} {month} {currentDate.getFullYear()}
      </Text>
      <Box pt={2}>
        {categories?.filter(category => (config?.popular_categories?.indexOf(category.id) >= 0))
          .map((category) => (
            <Link to={"/categoria/" + category.slug} key={category.id}>
              <Button
                mr={2}
                mb={2}
                height={'2em'}
                minW={'auto'}
                fontSize={'0.9em'}
                fontWeight={400}
                bg={'gray.200'}
                _hover={{
                  bg: 'gray.300',
                }}
              >
                {category.name}
              </Button>
            </Link>
          ))}
      </Box>
      <Box
        fontSize={'0.9em'}
        p={1}
        color={themeColor}
        _hover={{ color: 'gray.800' }}
      >
        <Link to="/categorias">
          {t(_t("All Categories"))} <ArrowForwardIcon />
        </Link>
      </Box>
    </Box>
  )
}

export default PopularCategories;