import { useState, useEffect, useRef } from "react";
import { CloseButton, Box } from "@chakra-ui/react";
import { getBannerService } from "../../Services/Banner";
import "./index.css";

const Banner = () => {
  const iframeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [banner, setBanner] = useState(null);

  const getBanner = async () => {
    const data = await getBannerService();
    setBanner(data);
  }

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setIframeHeight = () => {
      const { contentDocument, contentWindow } = iframe;
      if (!contentDocument || !contentWindow) return;
      const { body } = contentDocument;
      if (!body) return;
      const height = `${body.scrollHeight + 40}px`;
      if (iframe.style.height !== height) {
        iframe.style.height = height;
      }
    };

    const setMaxWidth = () => {
      const images = iframe.contentDocument.getElementsByTagName("img");
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!img.style.maxWidth) {
          img.style.maxWidth = "100%";
        }
        if (img.style.height !== "auto") {
          img.style.height = "auto";
        }
      }
    };

    const loadHandler = () => {
      setMaxWidth();
      setIframeHeight();
    };

    iframe?.addEventListener('load', loadHandler);

    setIframeHeight();

    return () => {
      iframe?.removeEventListener('load', loadHandler);
    };
  }, [banner]);

  useEffect(() => {
    if (sessionStorage.getItem('banner') === 'hide') {
      setIsOpen(false);
    } else {
      getBanner();
      setIsOpen(true);
    }
  }, []);

  return (
    isOpen &&
    <Box
      mb={5}
      bg={'white'}
      shadow={'0 3px 3px rgba(0,0,0,.15), 0 0 0 rgba(0,0,0,.15)'}
      position="relative"
      borderRadius={5}
    >
      <CloseButton
        size={'sm'}
        position="absolute"
        right={1}
        top={1}
        onClick={() => {
          sessionStorage.setItem('banner', 'hide');
          setIsOpen(false);
        }}
      />
      <iframe
        ref={iframeRef}
        title="banner"
        srcDoc={banner?.content}
        width='100%'
        frameBorder="0"
        scrolling="no"
      />
    </Box>
  )
}

export default Banner;