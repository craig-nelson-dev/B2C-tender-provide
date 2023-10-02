import React from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Carousel = ({ images }) => {
  // const [currentImage, setCurrentImage] = React.useState(0);

  // const nextImage = () => {
  //   setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  // };

  // const prevImage = () => {
  //   setCurrentImage((prevImage) => (prevImage - 1 + images.length) % images.length);
  // };

  return (
    <>
      <Flex align="center" justify="center" >
        <Box w="auto" h="170px" position="relative">
          <Image
            src={images[0]}
            alt="image"
            objectFit="cover"
            w="100%"
            h="100%"
          />
          {/* {images.length > 1 &&
            <Box
              userSelect={'none'}
              position="absolute"
              top="50%"
              left="0px"
              transform="translateY(-50%)"
              cursor="pointer"
              onClick={prevImage}
            >
              <FaArrowLeft
                style={{
                  color: 'white',
                  background: '#3182ce',
                  width: '16px',
                  height: '30px',
                  padding: '2px',
                  borderRadius: 2,
                }}
              />
            </Box>
          } */}
          {/* {images.length > 1 &&
            <Box
              userSelect={'none'}
              position="absolute"
              top="50%"
              right="0px"
              transform="translateY(-50%)"
              cursor="pointer"
              onClick={nextImage}
            >
              <FaArrowRight
                style={{
                  color: 'white',
                  background: '#3182ce',
                  width: '16px',
                  height: '30px',
                  padding: '2px',
                  borderRadius: 2,
                }}
              />
            </Box>
          } */}
        </Box>
      </Flex >
      {/* <Flex justifyContent={'center'} m={2}>
        {images.length > 1 && images.map((image, index) => (
          <Image
            key={index}
            m={1}
            src={image}
            h={'40px'}
            w={'auto'}
            alt={`image-${index}`}
            onClick={() => setCurrentImage(index)}
            _hover={{
              outline: '2px solid #3182ce'
            }}
            outline={index === currentImage ? '2px solid #3182ce' : 'none'}
            cursor={'pointer'}
          />
        ))}
      </Flex> */}
    </>
  );
};

export default Carousel;
