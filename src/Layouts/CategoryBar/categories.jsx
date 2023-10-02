import { Button, Flex, Box } from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useEffect, useRef, useState } from 'react';

const themeColor = "blue.500"

function CategoryBar({ categories, categorySlug = null }) {
  const containerRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    setIsOverflow(container.clientWidth < container.scrollWidth);
    getCategoryBySlug(categorySlug);
  }, [categories, categorySlug]);

  const getCategoryBySlug = (slug) => {
    categories.map((category) => {
      category.slug === slug && category.status && setCategory(category);
    })
  }

  const scrollLeft = () => {
    containerRef.current.scrollBy({
      left: -window.innerWidth + 100,
      behavior: "smooth",
    });
  }

  const scrollRight = () => {
    containerRef.current.scrollBy({
      left: window.innerWidth - 100,
      behavior: "smooth",
    });
  }

  return (
    <Box bg="white">
      <Flex align={'center'} height={'54px'} maxW={'1200px'} m={'auto'}>
        {isOverflow && <ChevronLeftIcon onClick={scrollLeft} bg={'transparent'} color={themeColor} boxSize={6} />}
        <Flex ref={containerRef} overflow={'hidden'}>
          {categories
            .filter(category => category.status)
            .map((item) => (
              (category ? item.parent_id === category.id : item.parent_id === -1) &&
              <Link to={"/categoria/" + item.slug} key={item.id}>
                <Button
                  key={item.id}
                  mr={2}
                  minW={'auto'}
                  fontSize={{ base: '0.8em', md: '0.9em' }}
                  fontWeight={400}
                  bg={'blue.50'}
                  color={themeColor}
                  _hover={{
                    bg: themeColor,
                    color: 'white'
                  }}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
        </Flex>
        {isOverflow && <ChevronRightIcon onClick={scrollRight} bg={'transparent'} color={themeColor} boxSize={6} />}
      </Flex>
    </Box>
  )
}

export default CategoryBar;