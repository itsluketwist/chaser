import dynamic from 'next/dynamic';
import { RichText } from 'prismic-reactjs';

import { buttonVariants } from 'components/shared/slice';
import { Grid, Flex, Heading, Box } from '@chakra-ui/react';

const Slice = dynamic(() => import('components/shared/slice'));
const Image = dynamic(() => import('components/shared/image'));
const Button = dynamic(() => import('components/shared/button'));
const Content = dynamic(() => import('components/shared/content'));

import { linkResolver } from 'modules/prismic';

const Item = ({ item, isImageLeft }) => (
  <Grid
    gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
    gridGap={{ base: 4, md: 9 }}
  >
    <Flex
      direction="column"
      justifyContent="center"
      order={{ base: 2, md: `${isImageLeft ? 2 : 1}` }}
    >
      {RichText.asText(item.title) && (
        <Heading as="h2" fontSize={{ base: 'xl', md: '3xl' }} mt={2}>
          {RichText.asText(item.title)}
        </Heading>
      )}

      {item.content && (
        <RichText render={item.content} linkResolver={linkResolver} />
      )}

      {item.cta_text && (
        <Box>
          <Button
            type="button"
            variant={buttonVariants[item.variant]}
            href={item.cta_url}
          >
            {item.cta_text}
          </Button>
        </Box>
      )}
    </Flex>

    <Flex
      direction="column"
      justifyContent="center"
      order={{ base: 1, md: `${isImageLeft ? 1 : 2}` }}
    >
      {item?.image?.url && (
        <Image
          alt={item?.image?.alt}
          src={item?.image?.url}
          layout="responsive"
          height={item.image?.dimensions?.height}
          width={item.image?.dimensions?.width}
        />
      )}
      {RichText.asText(item.support) && (
        <Box textAlign="center" pt={2} fontStyle="italic">
          <Content>
            <RichText render={item.support} linkResolver={linkResolver} />
          </Content>
        </Box>
      )}
    </Flex>
  </Grid>
);

const ImageAndContent = ({ items }) => {
  return (
    <>
      {items.map((item, i) => (
        <Slice variant={item.variant} key={`image-and-content-${i}`}>
          <Item
            item={item}
            isImageLeft={item.layout_content === 'image-left'}
          />
        </Slice>
      ))}
    </>
  );
};

export default ImageAndContent;
