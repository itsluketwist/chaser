import { PrismicRichText } from '@prismicio/react';
import * as prismicH from '@prismicio/helpers';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import format from 'date-fns/format';
import {
  linkResolver,
  getDocs,
  getPrismicDocByUid,
  getBasePageProps,
} from 'modules/prismic';

import {
  Box,
  Grid,
  Heading,
  Image as ChakraImage,
  Link as ChakraLink,
} from '@chakra-ui/react';
import GoogleMapReact from 'google-map-react';
import { TYPES } from 'components/clubsEvents/league-type';
import PrismicSlice from 'components/prismic';
import DescriptionList, {
  Description,
} from 'components/shared/description-list';
import useCachedResponse from 'hooks/useCachedResponse';

const HeroWithLocation = dynamic(() =>
  import('components/clubsEvents/hero-with-location')
);

const Slice = dynamic(() => import('components/shared/slice'));

const Page404 = dynamic(() => import('pages/404'));
const Meta = dynamic(() => import('components/shared/meta'));
const PageLoading = dynamic(() => import('components/shared/page-loading'));
const Content = dynamic(() => import('components/shared/content'));

const EventPage = ({ page: initialPage, preview }) => {
  const router = useRouter();

  const { data: queryData } = useCachedResponse({
    queryKey: ['clubs', router.query.uid],
    queryFn: () => getPrismicDocByUid('events', router.query.uid),
    selector: (res) => res,
    initialData: initialPage,
    enabled: Boolean(!router.isFallback),
  });

  const page = preview ? initialPage : queryData;

  if (router.isFallback && !queryData) {
    return <PageLoading />;
  }

  if (!queryData && !preview) {
    return <Page404 />;
  }

  const { data: event } = page;

  return (
    <>
      <Meta
        description={`${event.event_name} on ${format(
          new Date(event.event_start_date),
          'MMMM d, yyyy'
        )}`}
        subTitle={event.event_name}
        image={event?.images?.[0]?.image?.url}
      />

      <HeroWithLocation
        images={event.images}
        title={event.event_name}
        venue={event.venue}
        featuredColor={TYPES[event.leagues?.[0]?.league]}
        icon={event.icon}
        leagues={event.leagues.map(({ league }) => league)}
        coordinates={event.coordinates}
        startDate={event.event_start_date}
        endDate={event.event_end_date}
      />

      <Slice>
        <Grid
          gridTemplateColumns={{ base: '1fr', md: '2fr 1fr' }}
          gridGap={{ base: 4, md: 9 }}
        >
          <Box borderRadius="lg" bg="white" p={4}>
            <Heading
              as="h3"
              fontSize="xl"
              color="qukBlue"
              mt={0}
              fontFamily="body"
              mb={4}
            >
              About {event?.event_name}
            </Heading>
            {prismicH.asText(event.description) && (
              <Content color="qukBlue">
                <PrismicRichText field={event.description} />
              </Content>
            )}
          </Box>

          <Box borderRadius="lg" bg="white" p={4}>
            <Heading
              as="h3"
              fontSize="xl"
              color="qukBlue"
              fontFamily="body"
              mt={0}
              mb={4}
            >
              Registration details
            </Heading>
            <DescriptionList>
              <Description
                term="QUK Membership Required"
                description={event.quk_membership_required ? 'Yes' : 'No'}
              />
              {event?.individual_registration_deadline && (
                <Description
                  term="Individual Registration Deadline"
                  description={format(
                    new Date(event.individual_registration_deadline),
                    'MMMM d, yyyy'
                  )}
                />
              )}
              {event?.player_fee && (
                <Description
                  term="Individual Fee"
                  description={`£${event.player_fee}`}
                />
              )}
              {event?.club_registration_deadline && (
                <Description
                  term="Team Registration Deadline"
                  description={format(
                    new Date(event.club_registration_deadline),
                    'MMMM d, yyyy'
                  )}
                />
              )}
              {event?.team_fee && (
                <Description
                  term="Team Fee"
                  description={`£${event.team_fee}`}
                />
              )}
              {event?.individual_registration_link && (
                <Description
                  term="Registration"
                  description={
                    <ChakraLink
                      href={prismicH.asLink(
                        event?.individual_registration_link,
                        linkResolver
                      )}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Register
                    </ChakraLink>
                  }
                />
              )}
            </DescriptionList>

            <Box width="100%" h="250px" mt={4}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_MAPS_API_KEY }}
                defaultCenter={{
                  lat: event?.coordinates?.latitude,
                  lng: event?.coordinates?.longitude,
                }}
                defaultZoom={14}
              >
                <ChakraImage
                  src={event?.icon?.url}
                  alt={`${event?.event_name} logo`}
                  height="30px"
                  width="30px"
                  lat={event?.coordinates?.latitude}
                  lng={event?.coordinates?.longitude}
                  transform="translate(-50%, -50%)"
                />
              </GoogleMapReact>
            </Box>
          </Box>
        </Grid>
      </Slice>

      <PrismicSlice sections={event?.body} />
    </>
  );
};

export const getStaticProps = async ({ params: { uid }, previewData }) => {
  const page = (await getPrismicDocByUid('events', uid, previewData)) || null;
  const basePageProps = await getBasePageProps();

  return {
    props: { page, ...basePageProps },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('events', { pageSize: 100 });

  return {
    paths: allPages?.map(({ uid }) => `/events/${uid}`),
    fallback: true,
  };
};

export default EventPage;
