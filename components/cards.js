import React from 'react';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import PrismicWrapper from './prismic-wrapper';
import { Grid, Flex } from './layout';
import Card from './card';
import Image from './image';
import Heading from './heading';
import Content from './content';
import HorizontalScrollWrapper from 'components/horizontal-scroll-wrapper';

const CardsSlice = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    content: get(rawData, 'primary.content'),
    variant: get(rawData, 'primary.variant'),
    items: get(rawData, 'items'),
    horizontalScroll: get(rawData, 'primary.horizontalScroll'),
  };

  return (
    <PrismicWrapper
      variant={data.variant}
      px={{ _: data.horizontalScroll ? 0 : 'gutter._', s: 'gutter.s', m: 'gutter.m'}}
      >
      {RichText.asText(data.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2} textAlign="center">
          {RichText.asText(data.title)}
        </Heading>
      )}

      {data.content && <Content textAlign="center" pb={3}>{RichText.render(data.content)}</Content>}

      <HorizontalScrollWrapper horizontalScroll={data.horizontalScroll} itemsCount={data.items?.length}>
        {data.items.map((itemData, i) => {
          const item = {
            title: get(itemData, 'title'),
            content: get(itemData, 'content'),
            image: get(itemData, 'image'),
          };

          return (
            <Flex flexDirection="column" key={`cards-${i}`}>
              <Card
                variant="light"
                name={item.title}
                content={item.content}
                image={item.image.url ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.alt}
                    width={1600}
                    height={900}
                  />
                ) : null}
              />
            </Flex>
          );
        })}
      </HorizontalScrollWrapper>
    </PrismicWrapper>
  );
};

export default CardsSlice;
