import styled from 'styled-components';
import { typography, color } from 'styled-system';

export const TYPES = {
  University: 'keeperGreen',
  Community: 'northernMagenta',
};

const Type = styled.span`
  ${typography};
  ${color};
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.radius[1]};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
`;

export default Type;