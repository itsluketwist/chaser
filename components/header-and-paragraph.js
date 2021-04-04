import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import { Flex, Heading } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const PrismicWrapper = dynamic(() => import('components/prismic-wrapper'));
const Button = dynamic(() => import('components/button'));
const Content = dynamic(() => import('components/content'));
const ExternalLink = dynamic(() => import('components/external-link'));

import { buttonVariants } from 'components/prismic-wrapper';
import { linkResolver } from 'modules/prismic';

const HeaderAndParagraph = (rawData) => {
  const title = get(rawData, 'primary.title');
  const centerTitle = get(rawData, 'primary.center_title');
  const content = get(rawData, 'primary.content');
  const variant = get(rawData, 'primary.variant');
  const cta_text = get(rawData, 'primary.cta_text');
  const cta_url = get(rawData, 'primary.cta_url');

  return (
    <PrismicWrapper variant={variant} small>
      {RichText.asText(title) && (
        <Heading
          as="h2"
          fontSize="3xl"
          mt={2}
          textAlign={centerTitle ? 'center' : 'left'}
        >
          {RichText.asText(title)}
        </Heading>
      )}

      {RichText.asText(content) && (
        <Content>
          <RichText render={content} linkResolver={linkResolver} />
        </Content>
      )}

      {cta_text && cta_url && (
        <Flex justifyContent="center">
          <ExternalLink href={cta_url}>
            <Button type="button" variant={buttonVariants[variant]} ml={2}>
              {cta_text}
            </Button>
          </ExternalLink>
        </Flex>
      )}
    </PrismicWrapper>
  );
};

export default HeaderAndParagraph;
