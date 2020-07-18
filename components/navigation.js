import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';
import Headroom from 'react-headroom';
import styled from 'styled-components';
import { space, variant } from 'styled-system';
import { transparentize, tint, rgba } from 'polished';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { Flex } from 'components/layout';
import cookies from 'js-cookie';
import HamburgerIcon from 'public/images/hamburger.svg';
import { MAIN_NAVIGATION, DASHBOARD_NAVIGATION } from 'constants/navigation';
import { removeCookie } from 'modules/cookies';
import ActiveLink, { ParentWrapper, ExactActiveLink } from './active-link';
import { Logo, LogoLink } from './logo';
import Button from './button';

const logo = '/images/logo.png';
const logoText = '/images/logo-text.png';

const Wrapper = styled(Headroom)`
  position: relative;
  z-index: ${({ open }) => (open ? 7 : 5)};
`;

const variants = (theme) => ({
  primary: {
    bg: theme.colors.primary,
  },

  white: {
    bg: theme.colors.white,
  },
});

const Header = styled.header`
  ${space};
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.box};
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: row;
  height: 60px;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    height: 50px;
  }

  ${({ theme }) => variant({ variants: variants(theme) })};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const List = styled.ul`
  align-items: center;
  display: flex;
  flex-direction: row;
  list-style-type: none;
  padding-left: 0;

  a {
    text-decoration: none;
  }

  span {
    &.active {
      color: ${({ theme }) => theme.colors.secondary};

      @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
        font-weight: 700;
      }
    }

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  li {
    cursor: pointer;
  }

  ul {
    display: flex;
    flex-direction: column;
    max-height:0;
    overflow: hidden;
    justify-content: flex-start;
    transition: max-height 0.3s;
    width: 0;
    justify-content: flex-start;
    position: absolute;
    top: 35px;

    @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
      width: auto;
    }
  }

  li:hover > ul, 
  li:focus > ul,
  li ul:focus {
    border-top: 25px solid ${rgba(0, 0, 0, 0)};
    display: flex;
    overflow: hidden;
    flex-direction: column;
    justify-content: flex-start;
    position: absolute;
    width: auto;
    top: 35px;
    z-index: 15;
    max-height: 400px;

    li {
      background: ${({ theme }) => theme.colors.white};
      box-shadow: 0 10px 0.625rem rgba(0,0,0,0.3);
      width: 100%;

      a {
        color: ${({ theme }) => theme.colors.greyDark};
        display: block;
        width: 100%;

        &:hover {
          color: ${({ theme }) => theme.colors.white};
        }
      }

      span {
        color: inherit;
        display: block;
        padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
        width: 100%;
        font-weight: normal;

        &:hover {
          color: ${({ theme }) => theme.colors.white};
        }

        &.active {
          background: ${({ theme }) => theme.colors.secondary};
          color: ${({ theme }) => theme.colors.white};
        }
      }

      &:hover {
        background: ${({ theme }) => theme.colors.secondary};
        color: ${({ theme }) => theme.colors.white};
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    display: flex;
    flex-direction: column;
    height: 100vh;
    top: 0;
    justify-content: flex-start;
    overflow-y:auto;
    left: 0;
    margin: 0;
    padding: 60px ${({ theme }) => theme.space[4]} 120px;
    position: absolute;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s;
    width: 100%;
    z-index: 4;

    span:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
    
    li > ul,
    ul,
    li:hover > ul, 
    li:focus > ul,
    li ul:focus {
      background: unset;
      border-top: 0;
      display: block;
      margin: initial;
      max-height: 0;
      overflow: hidden;
      padding: initial;
      position: initial;
      transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
      transition: max-height 0.3s;

      li {
        box-shadow: none;
        display: flex;
        margin: ${({ theme }) => theme.space[3]} auto;
        width: 100%;

        a {
          width: 100%;

          &:hover {
            color: ${({ theme }) => theme.colors.secondary};
          }
        }

        span {
          background: ${({ theme }) => tint(0.7, theme.colors.primary)};
          display: block;
          padding: ${({ theme }) => theme.space[2]} 0;

          &.active {
            background: ${({ theme }) => theme.colors.primary};
            color: ${({ theme }) => theme.colors.white};

            &:hover {
              color: ${({ theme }) => theme.colors.primary};
            }
          }

          &:hover {
            color: ${({ theme }) => theme.colors.primary};
          }
        }
      }

      &.dropdown, .dropdown:hover {
        height: auto;
        max-height: 250px;
      }
    }
  }
`;

const Item = styled.li`
  ${space};

 &:first-of-type {
   padding-left: 0;
 }

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    padding-left: 0;
    width: 100%;
    margin-bottom: ${({ theme }) => theme.space[4]};

    button {
      width: 100%;
    }
  }
`;

const NavItem = styled.span`
  color: ${({ theme }) => theme.colors.greyDark};
  font-weight: bold;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    background: ${({ theme }) => theme.colors.white};
    border: ${({ isButton }) => (isButton ? '0' : '1px')} solid ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radii[0]};
    color: ${({ theme }) => theme.colors.darkBlue};
    display: block;
    font-weight: normal;
    padding: ${({ theme, isButton }) => (isButton ? 0 : theme.space[2])} ${({ theme, isButton }) => (isButton ? 0 : theme.space[4])};
    text-align: center;

    &:hover {
      background: ${({ theme }) => tint(0.9, theme.colors.primary)};
    }
  }
`;

const Hamburger = styled(HamburgerIcon)`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    color: ${({ white, theme }) => (white ? theme.colors.white : theme.colors.primary)};
    cursor: pointer;
    display: block;
    z-index: 7;
    position: absolute;
    top: 10px;
    right: 1rem;
  }
`;

const Overlay = styled.div`
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => transparentize(0.1, theme.colors.primary)};
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s;
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
`;

const LogoWrapper = styled(Flex)`
  width: initial;

  @media (max-width: ${({ theme }) => theme.breakpoints.l}) {
    background: ${({ theme, open }) => (open ? theme.colors.primary : 'inherit')};
    display: flex;
    width: 100%;
    padding: 0 ${({ theme, open }) => (open ? theme.space.gutter._ : 0)};
    height: 50px;
    align-items: center;
    z-index: 5;
  }
`;

function Navigation({ dashboard }) {
  const loggedIn = cookies.get('AUTHENTICATION_TOKEN');
  const [open, setOpen] = useState(false);
  const [navigationToggle, setNavigationToggle] = useState(1000);
  const navigation = dashboard ? DASHBOARD_NAVIGATION : MAIN_NAVIGATION;

  const scrollRef = useRef();

  useEffect(() => {
    if (open) {
      disableBodyScroll(scrollRef.current);
    } else {
      enableBodyScroll(scrollRef.current);
    }
  }, [open]);

  const signOut = () => {
    removeCookie('AUTHENTICATION_TOKEN');
    Router.push('/');
  };

  return (
    <Wrapper open={open}>
      <Overlay open={open} />
      <Header variant={dashboard ? 'primary' : 'white'} px={{ _: (open ? 0 : 'gutter._') }}>
        <LogoWrapper open={open}>
          <Link href="/" passHref>
            <LogoLink onClick={() => setOpen(false)}>
              <>
                <Logo src={logo} alt="Quidditch UK" white={open || dashboard} />
                <Logo src={logoText} alt="Quidditch UK" white={open || dashboard} />
              </>
            </LogoLink>
          </Link>
        </LogoWrapper>

        <Nav>
          <List open={open} ref={scrollRef}>
            {navigation.map((item, i) => (
              <Item key={item.label} pl={6}>
                {item.list
                  ? (
                    <ParentWrapper path={item.path}>
                      <NavItem onClick={() => setNavigationToggle(navigationToggle === i ? 1000 : i)}>{item.label}</NavItem>
                    </ParentWrapper>
                  )
                  : (
                    <ActiveLink href={item.href} as={item.as}>
                      <NavItem onClick={() => setOpen(false)}>{item.label}</NavItem>
                    </ActiveLink>
                  )}

                {item.list && (
                  <List className={`${navigationToggle === i ? 'dropdown' : ''}`}>
                    {item.list.map((subItem) => (
                      <Item key={subItem.as}>
                        <ActiveLink href={subItem.href} as={subItem.as}>
                          <NavItem onClick={() => setOpen(false)}>{subItem.label}</NavItem>
                        </ActiveLink>
                      </Item>
                    ))}
                  </List>
                )}
              </Item>
            ))}

            <Item pl={8}><Link href="/find-quidditch" passHref><a><Button type="button" variant={dashboard ? 'secondary' : { _: 'secondary', l: 'primary' }} onClick={() => setOpen(false)}>Find Quidditch</Button></a></Link></Item>

            {!loggedIn && (
              <Item pl={4}>
                <Link href="/login" passHref>
                  <a>
                    <Button type="button" variant="light" onClick={() => setOpen(false)} mb={{ _: 4, l: 0 }}>
                      Sign in
                    </Button>
                  </a>
                </Link>
              </Item>
            )}

            {loggedIn && (
              <Item pl={4}>
                <ParentWrapper path="/dashboard">
                  <NavItem onClick={() => setNavigationToggle(navigationToggle === 20 ? 1000 : 20)} isButton><Button type="button" variant="light" py={{ _: 3, l: 2 }}>My Account</Button></NavItem>
                </ParentWrapper>

                <List className={`${navigationToggle === 20 ? 'dropdown' : ''}`}>
                  <Item>
                    <ExactActiveLink href="/dashboard" as="/dashboard">
                      <NavItem onClick={() => setOpen(false)}>Dashboard</NavItem>
                    </ExactActiveLink>
                  </Item>
                  <Item>
                    <ActiveLink href="/dashboard/account/profile" as="/dashboard/account/profile">
                      <NavItem onClick={() => setOpen(false)}>My profile</NavItem>
                    </ActiveLink>
                  </Item>
                  <Item>
                    <Link href="/" as="/">
                      <a>
                        <NavItem
                          onClick={() => {
                            setOpen(false);
                            signOut();
                          }}
                        >Sign out
                        </NavItem>
                      </a>
                    </Link>
                  </Item>
                </List>
              </Item>
            )}
          </List>

          <Hamburger
            white={open || dashboard}
            aria-hidden="true"
            onClick={() => setOpen(!open)}
          />
        </Nav>
      </Header>
    </Wrapper>

  );
}

Navigation.defaultProps = {
  dashboard: false,
};

Navigation.propTypes = {
  dashboard: PropTypes.bool,
};

export default Navigation;
