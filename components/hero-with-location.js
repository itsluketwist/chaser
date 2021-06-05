import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Image as ChakraImage,
  Link as ChakraLink,
} from '@chakra-ui/react';
import format from 'date-fns/format';
import dynamic from 'next/dynamic';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import { TYPES } from 'components/club-type';
import { useBreakpoint } from 'hooks/media';
import base, { rem } from 'styles/theme';

const Type = dynamic(() => import('components/club-type'));
const Image = dynamic(() => import('components/image'));
const Carousel = dynamic(() => import('components/carousel'));
const PinIcon = dynamic(() => import('public/images/location-pin.svg'));

const HeroWithLocation = ({
  images,
  leagues,
  featuredColor,
  textColor,
  icon,
  title,
  coordinates,
  venue,
  startDate,
  endDate,
}) => {
  const isDesktop = useBreakpoint(base.breakpoints.lg);
  return (
    <>
      <Box
        as="section"
        position="relative"
        bg="greyLight"
        minHeight={BLOG_MIN_HEIGHTS}
      >
        {isDesktop && images.length > 1 && (
          <Grid
            templateColumns="2fr 1fr 1fr"
            templateRows="1fr 1fr"
            gap={4}
            p={4}
          >
            {images.map(({ image }, i) => {
              const isFirst = i === 0;
              const width = isFirst ? 1000 : 500;
              const height = isFirst ? 730 : 350;

              return (
                <Box
                  key={`hero-image-${image.url}-${i}`}
                  gridColumn={isFirst ? 1 : null}
                  gridRow={isFirst ? '1 / span 2' : null}
                >
                  <Image
                    priority={isFirst}
                    src={image.url}
                    fill="responsive"
                    width={width}
                    height={height}
                    alt={image.alt}
                  />
                </Box>
              );
            })}
          </Grid>
        )}

        {isDesktop && images.length <= 1 && (
          <Carousel images={images} width="600" height="175" priority={true} />
        )}
        {!isDesktop && <Carousel images={images} width="600" height="375" />}

        <Box
          position="absolute"
          right="0"
          top="0"
          padding={{ base: 4, sm: 8, md: 9 }}
        >
          {leagues.map((league) => (
            <Type
              key={league}
              fontWeight="bold"
              fontSize={[rem(10), rem(16)]}
              bg={TYPES[league]}
              ml="1"
            >
              {league}
            </Type>
          ))}
        </Box>
      </Box>
      <Box
        as="section"
        position="relative"
        bg={featuredColor}
        color={textColor}
        px={{ base: 4, sm: 8, md: 9 }}
        py="0"
        height="130px"
      >
        <Flex
          justifyContent="flex-start"
          alignItems="center"
          position="relative"
          top={{ base: 0, md: '-65px' }}
        >
          <Box maxWidth={{ base: '130px', md: '260px' }} p={4}>
            <ChakraImage src={icon?.url} alt={`${title} logo`} width="100%" />
          </Box>
          <Flex flexDirection="column">
            <Heading
              as="h2"
              py="0"
              my="0"
              fontSize={{ base: '2xl', md: '4xl' }}
            >
              {title}
            </Heading>

            <Flex alignItems="center">
              <ChakraImage as={PinIcon} height="15px" width="15px" />{' '}
              <ChakraLink
                p={1}
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
                color={textColor}
                borderBottom={`2px dotted ${textColor}`}
                href={`https://www.google.com/maps/search/?api=1&query=${coordinates?.latitude},${coordinates?.longitude}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {venue}
              </ChakraLink>
            </Flex>

            {startDate && (
              <Text as="span" fontWeight="bold" color="white" pt={2}>
                {!!startDate && (
                  <>{format(new Date(startDate), 'MMMM d, yyyy')} </>
                )}
                {startDate !== endDate && !!endDate && (
                  <> - {format(new Date(endDate), 'MMMM d, yyyy')}</>
                )}
              </Text>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default HeroWithLocation;
