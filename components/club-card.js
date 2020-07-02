import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space, color } from 'styled-system';
import Heading from 'components/heading';
import Type, { TYPES } from 'components/club-type';
import { rem } from '../styles/theme';

const StyledCard = styled.article`
  border-radius: ${({ theme }) => theme.radii[1]};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.125s;
  
  ${color};
  ${space};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.box};
  }
`;

const Image = styled.div`
  position: relative;
  z-index: 2;
`;

const IconContainer = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  position: absolute;
  right: 0;
  z-index: 3;
`;

const Icon = styled.img`
  border-radius: 50%;
  height: 75px;
  width: 75px;
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[4]};

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ClubCard = ({
  image,
  name,
  league,
  icon,
  venue,
  ...cardProps
}) => (
  <StyledCard {...cardProps}>
    {image ? (<Image>{image}</Image>) : null}
    <IconContainer><Icon src={icon} alt={`${name} logo`} /></IconContainer>

    <Content>
      <Type fontWeight="bold" fontSize={(rem(10))} bg={TYPES[league]}>{league}</Type>
      <Heading as="h2" fontSize={3} isBody>{name}</Heading>
      <p>{venue}</p>
    </Content>
  </StyledCard>
);

ClubCard.defaultProps = {
  name: null,
  league: null,
  image: null,
  venue: null,
  icon: null,
};

ClubCard.propTypes = {
  name: PropTypes.string,
  league: PropTypes.string,
  venue: PropTypes.string,
  icon: PropTypes.string,
  image: PropTypes.shape({}),
};

export default ClubCard;
