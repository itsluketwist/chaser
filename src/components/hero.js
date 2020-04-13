import React from 'react';
import get from 'just-safe-get';
import { Box, Flex } from './layout';
import Heading from './heading';

const Hero = (rawData) => {
  const data = {
    title: get(rawData, 'primary.slug'),
    image: get(rawData, 'primary.image.url'),
  };

  return (
    <Box
      as="section"
      position="relative"
      backgroundImage={`url(${data.image})`}
      backgroundColor="primary"
      backgroundSize="cover"
      backgroundPosition="center"
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
      minHeight={{ _: '30vh', m: '70vh' }}
    >
      <Flex
        position="relative"
        minHeight={{ _: '30vh', m: '70vh' }}
        alignItems="center"
        justifyContent="center"
        py={{ _: 9, m: 13 }}
      >
        <Heading fontSize={[4, 4, 5]} color="white">{data.title}</Heading>
      </Flex>
    </Box>
  );
};
export default Hero;