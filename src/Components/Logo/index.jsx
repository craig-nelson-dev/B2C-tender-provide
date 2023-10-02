import { Box, Image } from "@chakra-ui/react";
import { useHistory } from 'react-router-dom';

function Logo() {
  const history = useHistory();
  const logo = (
    <Box
      ml={'20px'}
      width={'74px'}
      height={'54px'}
      onClick={() => {
        history.push('/');
      }}
      cursor={'pointer'}
      display={'inline-flex'}
    >
      <Image src={"/logo.png"} title="logo.png" />
    </Box>
  );

  return logo;
}

export default Logo;