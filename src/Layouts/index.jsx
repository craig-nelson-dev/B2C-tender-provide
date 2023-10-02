import {
  Box,
  Flex,
  Button,
  Spacer,
  // HStack,
  // VStack,
  Icon,
  Image,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  useToast,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  // EmailIcon,
  // BellIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
// import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { FaUser, FaPlus } from "react-icons/fa";
import "./index.css";
import Logo from "../Components/Logo";
import SearchBar from './SearchBar';
import MenuBar from "./MenuBar";
import AdminMenu from "./AdminMenu";

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { changePasswordService, resendCodeService, resetPasswordService, signInService, signUpService, verifyCodeService } from "../Services/User";
import { useTranslation } from "react-i18next";
import { _t } from "../Utils/_t";

export default function Navbar() {
  const { t } = useTranslation()
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isPWDLoading, setIsPWDLoading] = useState(false);
  const [isEmailVerify, setIsEmailVerify] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChangePWD, setIsChangePWD] = useState(false);
  const [code, setCode] = useState("");
  const [oldPWD, setOldPWD] = useState("");
  const [newPWD, setNewPWD] = useState("");
  const [confirmPWD, setConfirmPWD] = useState("");
  const [isForgotProcessing, setForgotProcessing] = useState(0)

  const appMode = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });
  const themeColor = "blue.500";
  const toast = useToast();

  useEffect(() => {
    // Retrieve the state from localStorage on component mount
    const storedState = JSON.parse(localStorage.getItem('authToken'));
    if (storedState) {
      setAuthToken(storedState);
    }
  }, []);

  // let timer;
  // const resetTimer = () => {
  //   clearTimeout(timer);
  //   timer = setTimeout(handleSignOut, 60 * 60 * 1000);
  // };

  // const userEvents = ['click', 'mousemove', 'keydown'];
  // userEvents.forEach((event) => {
  //   document.addEventListener(event, resetTimer);
  // });

  const handleSignInOpenModal = () => {
    setIsSignInOpen(true);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSignInLoading(true);

    const response = await signInService(email, password);
    setIsSignInLoading(false);

    if (response.status === 200) {
      localStorage.setItem('authToken', JSON.stringify(response.data));
      window.location.reload();
    } else {
      toast({
        title: t(_t('Error.')),
        description: response.response.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSignUpLoading(true);

    const response = await signUpService(email, password, username, birthday);
    setIsSignUpLoading(false);

    if (response.status === 200) {
      setIsSignUpOpen(false)
      setForgotProcessing(false)
      setIsEmailVerify(true);
    } else {
      toast({
        title: t(_t('Error.')),
        description: response.response.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    window.location.reload();
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPWD !== confirmPWD) {
      toast({
        title: t(_t('Error.')),
        description: t(_t("New password doesn't match")),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return;
    }

    if (isForgotProcessing) {
      setIsPWDLoading(true);
      var response = await resetPasswordService({
        email: email,
        password: newPWD
      })
      setIsPWDLoading(false);

      if (response.status === 200) {
        toast({
          title: t(_t('Success.')),
          description: t(_t("Resetting password success")),
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setOldPWD("")
        setNewPWD("")
        setConfirmPWD("")
        setIsChangePWD(false)
        setIsSignInOpen(true)
      } else {
        toast({
          title: t(_t('Error.')),
          description: t(_t("Resetting password failed")),
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } else {
      setIsPWDLoading(true);
      var user = JSON.parse(localStorage.getItem("authToken")).user
      var response = await changePasswordService({
        email: user.email,
        old_password: oldPWD,
        new_password: newPWD
      });
      setIsPWDLoading(false);

      if (response.status === 200) {
        toast({
          title: t(_t('Success.')),
          description: t(_t("Changing password success")),
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setOldPWD("")
        setNewPWD("")
        setConfirmPWD("")
        setIsChangePWD(false)
      } else {
        toast({
          title: t(_t('Error.')),
          description: t(_t("Your password is incorrect.")),
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  const handleForgotPassword = async () => {
    setIsPWDLoading(true);
    var response = await resendCodeService(email);
    setIsPWDLoading(false);
    if (response.status === 200) {
      setIsSignInOpen(false)
      setIsEmailVerify(true)
      setForgotProcessing(true)
    } else {
      toast({
        title: t(_t('Error.')),
        description: t(_t("Failed to send code")),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const toSignUp = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(true);
  }

  const toSignIn = () => {
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  }

  const handleVerifyCode = async (e) => {
    setIsVerifying(true);
    const response = await verifyCodeService(email, code);
    setIsVerifying(false);
    if (response.status === 200) {
      if (isForgotProcessing) {
        setIsChangePWD(true)
        setIsEmailVerify(false)
      } else {
        toast({
          title: t(_t('Email')),
          description: t(_t("You have registered successfully.")),
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setTimeout(() => {
          handleSignIn(e);
        }, 100);
      }
    } else {
      toast({
        title: t(_t('Error.')),
        description: response.response.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setCode("");
    }
  }

  const handleOpenChangePWD = async () => {
    setIsChangePWD(true)
    setForgotProcessing(false)
  }

  const handleResendCode = async (e) => {
    setIsPWDLoading(true);
    const response = await resendCodeService(email);
    setIsPWDLoading(false);
    if (response.status === 200) {
      toast({
        title: t(_t('Success')),
        description: t(_t("Email Sent.")),
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: t(_t('Error.')),
        description: response.response.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <div id="navFix">
      <Box
        bg={themeColor}
        px={2.5}
        width={["100%"]}
      >
        <Flex
          h={'54px'}
          maxW={'1200px'}
          m={'auto'}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {appMode === 'lg' && <Logo />}

          <MenuBar appMode={appMode} />

          {authToken?.user?.role === "admin" && <AdminMenu />}

          {(authToken?.user?.role === "vip" || authToken?.user?.role === "customer") &&
            <Link to="/chollos">
              <Button
                className="btnRes"
                border={`solid white 2px`}
                bg={themeColor}
                fontWeight={'normal'}
                color={'white'}
                _hover={{
                  color: themeColor,
                  bg: 'white',
                }}
                ml={'10px'}
              >
                {t(_t('My Deals'))}
              </Button>
            </Link>
          }

          < Spacer />

          <SearchBar appMode={appMode} />

          {authToken &&
            <>
              <Menu>
                <MenuButton
                  as={Button}
                  border={`solid white 2px`}
                  bg={themeColor}
                  fontWeight={'normal'}
                  color={'white'}
                  _hover={{
                    color: themeColor,
                    bg: 'white',
                  }}
                  ml={'10px'}
                >
                  {appMode === 'lg' ? (
                    t(_t('Share Deal'))
                  ) : (
                    <Icon as={FaPlus} boxSize={3} />
                  )}
                </MenuButton>
                <MenuList>
                  <Link to="/crear/chollo">
                    <MenuItem>{t(_t("Deal"))}</MenuItem>
                  </Link>
                  <Link to="/crear/descuento">
                    <MenuItem>{t(_t("Discount"))}</MenuItem>
                  </Link>
                </MenuList>
              </Menu>
              {/* <HStack m={'0 10px'}>
                <EmailIcon
                  boxSize={6}
                  color={'white'}
                  ml={'10px'}
                />
                <BellIcon
                  boxSize={6}
                  color={'white'}
                  ml={'10px'}
                />
              </HStack>

              <VStack
                color={'white'}
                fontSize={'0.8em'}
                lineHeight={0.8}
              >
                <span>200</span>
                <span>Points</span>
              </VStack> */}
            </>
          }
          {authToken ?
            <Menu>
              <MenuButton
                as={Flex}
                align={'center'}
                ml={2}
                cursor={'pointer'}>
                <Avatar
                  name={authToken.user?.name}
                  src={authToken.user?.avatar}
                  style={{ width: "40px", height: "40px" }}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleOpenChangePWD} >{t(_t("Change Password"))}</MenuItem>
                <MenuItem onClick={handleSignOut}>{t(_t("Logout"))}</MenuItem>
              </MenuList>
            </Menu>
            :
            <Button
              className="btnRes"
              border={`solid white 2px`}
              bg={'#f7aa00'}
              color={'white'}
              fontWeight={'normal'}
              _hover={{
                color: themeColor,
                bg: 'white',
              }}
              ml={'10px'}
              onClick={handleSignInOpenModal}
            >
              {appMode === 'lg' ? (
                t(_t('Sign In'))
              ) : (
                <Icon as={FaUser} boxSize={3} />
              )}
            </Button>
          }
        </Flex>
      </Box>
      <Modal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t(_t("Sign in"))}</ModalHeader>
          <ModalCloseButton />
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Image
              src={window.location.origin + "/logo.png"}
              alt="logo"
              bg={themeColor}
              w={'180px'}
              h={'180px'}
              m={'auto'}
              p={2}
              mb={5}
            />
            <Stack spacing={4}>
              {/* <Button
                // onClick={onClick}
                bg="blue.500"
                color="white"
                _hover={{ bg: 'blue.600' }}
                _active={{ bg: 'blue.700' }}
              >
                <FaFacebookF />
                <Text ml={3}>Continue with Facebook</Text>
              </Button>
              <Button
                // onClick={onClick}
                onClick={() => handleSignInGoogle(true)}
                bg="red.500"
                color="white"
                _hover={{ bg: 'red.600' }}
                _active={{ bg: 'red.700' }}
              >
                <FaGoogle />
                <Text ml={3}>Continue with Google</Text>
              </Button>
              <Spacer height={4} /> */}
              <form onSubmit={handleSignIn}>
                <FormControl id="email" mt={3} isRequired>
                  <FormLabel>{t(_t("Email address"))}</FormLabel>
                  <Input type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
                </FormControl>
                <FormControl id="password" mt={3} isRequired>
                  <FormLabel>{t(_t("Password"))}</FormLabel>
                  <Input type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)} />
                </FormControl>
                <Stack spacing={10} mt={2}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                  // justify={"space-between"}
                  >
                    <Checkbox>{t(_t("Remember me"))}</Checkbox>
                    <Spacer />
                    {isPWDLoading && <Spinner color="blue.500" />}
                    <Text
                      onClick={handleForgotPassword}
                      color={"blue.400"} cursor={'pointer'}>{t(_t("Forgot password?"))}
                    </Text>
                  </Stack>
                  <Button
                    isLoading={isSignInLoading}
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    type="submit"
                  >
                    {t(_t("Sign in"))}
                  </Button>
                </Stack>
              </form>
              <Stack pt={6} alignItems={'center'}>
                <Text>
                  {t(_t("Don't have an account?"))}
                </Text>
                <Text color={'blue.400'} onClick={toSignUp} cursor={'pointer'}>{t(_t("Signup"))}</Text>
              </Stack>
            </Stack>
          </Box>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t(_t("Sign up"))}</ModalHeader>
          <ModalCloseButton />
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Image
              src={window.location.origin + "/logo.png"}
              alt="logo"
              bg={themeColor}
              w={'180px'}
              h={'180px'}
              m={'auto'}
              p={2}
              mb={5}
            />
            <Stack spacing={4}>
              {/* <Button
                // onClick={onClick}
                bg="blue.500"
                color="white"
                _hover={{ bg: 'blue.600' }}
                _active={{ bg: 'blue.700' }}
              >
                <FaFacebookF />
                <Text ml={3}>Continue with Facebook</Text>
              </Button>
              <Button
                onClick={() => handleSignInGoogle(false)}
                bg="red.500"
                color="white"
                _hover={{ bg: 'red.600' }}
                _active={{ bg: 'red.700' }}
              >
                <FaGoogle />
                <Text ml={3}>Continue with Google</Text>
              </Button>
              <Spacer height={4} /> */}
              <form onSubmit={handleSignUp}>
                <FormControl id="name" isRequired mt={3}>
                  <FormLabel>{t(_t("User Name"))}</FormLabel>
                  <Input type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)} />
                </FormControl>
                <FormControl id="email" isRequired mt={3}>
                  <FormLabel>{t(_t("Email address"))}</FormLabel>
                  <Input type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
                </FormControl>
                <FormControl id="gender" isRequired mt={3}>
                  <FormLabel>{t(_t("Birthday"))}</FormLabel>
                  <Input type="date"
                    value={birthday}
                    onChange={e => setBirthday(e.target.value)} />
                </FormControl>
                <FormControl id="password" isRequired mt={3}>
                  <FormLabel>{t(_t("Password"))}</FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)} />
                    <InputRightElement h={'full'}>
                      <Button
                        variant={'ghost'}
                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    type="submit"
                    isLoading={isSignUpLoading}
                    size="lg"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}>
                    {t(_t("Sign up"))}
                  </Button>
                </Stack>
              </form>
              <Stack pt={6} alignItems={'center'}>
                <Text>
                  {t(_t("Already have an account?"))}
                </Text>
                <Text color={'blue.400'} cursor={'pointer'} onClick={toSignIn}>{t(_t("Signin"))}</Text>
              </Stack>
            </Stack>
          </Box>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEmailVerify} onClose={() => setIsEmailVerify(false)} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t(_t("OTP Verification"))}</ModalHeader>
          <ModalCloseButton />
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Text mb={5}>{t(_t('Verification code has been sent to your email.'))}</Text>
            <FormControl id="otp" mb={4} isRequired>
              <Input type="text" placeholder={t(_t("Enter OTP CODE"))} value={code}
                onChange={(e) => setCode(e.target.value)} />
            </FormControl>
            <Flex>
              {isPWDLoading && <Spinner color="blue.500" mr={2} />}
              <Text
                onClick={handleResendCode}
                color={'blue.400'}
                cursor={'pointer'}
              >
                {t(_t("Resend code"))}
              </Text>
              <Spacer />
              <Button isLoading={isVerifying} colorScheme="blue" onClick={handleVerifyCode}>{t(_t("Verify"))}</Button>
            </Flex>
          </Box>
        </ModalContent>
      </Modal>
      <Modal isOpen={isChangePWD} onClose={() => setIsChangePWD(false)} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t(_t('Change Password'))}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleChangePassword}>
            <ModalBody>
              {
                !isForgotProcessing &&
                <FormControl mt={5} isRequired>
                  <FormLabel>{t(_t('Current Password'))}</FormLabel>
                  <Input type="password" value={oldPWD} onChange={(e) => { setOldPWD(e.target.value) }} />
                </FormControl>
              }
              <FormControl mt={5} isRequired>
                <FormLabel>{t(_t('New Password'))}</FormLabel>
                <Input type="password" value={newPWD} onChange={(e) => { setNewPWD(e.target.value) }} />
              </FormControl>
              <FormControl mt={5} isRequired isInvalid={confirmPWD !== newPWD}>
                <FormLabel>{t(_t('Confirm Password'))}</FormLabel>
                <Input type="password" value={confirmPWD} onChange={(e) => { setConfirmPWD(e.target.value) }} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsChangePWD(false)} mr={3}>{t(_t('Cancel'))}</Button>
              <Button isLoading={isPWDLoading} type="submit" colorScheme="blue">{t(_t('Change'))}</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
