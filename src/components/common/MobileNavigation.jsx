import { BasketToggle } from "@/components/basket";
import {
  HOME,
  SHOP,
  FEATURED_PRODUCTS,
  RECOMMENDED_PRODUCTS,
  SIGNIN,
  VIEW_PRODUCT,
} from "@/constants/routes";
import PropType from "prop-types";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { Link, useLocation, matchPath, useHistory } from "react-router-dom";
import UserNav from "@/views/account/components/UserAvatar";
import Badge from "./Badge";
import FiltersToggle from "./FiltersToggle";
import SearchBar from "./SearchBar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ShareIcon from "@mui/icons-material/Share";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from "@mui/material";

const Navigation = (props) => {
  const { isAuthenticating, basketLength, disabledPaths, user } = props;
  const { pathname } = useLocation();

  const onClickLink = (e) => {
    if (isAuthenticating) e.preventDefault();
  };

  return (
    <nav className="mobile-navigation">
      <div className="mobile-navigation-main">
        <div className="mobile-navigation-logo">
          <Link onClick={onClickLink} to={HOME}>
            <h2>Sabiyya Collections</h2>
          </Link>
        </div>

        <BasketToggle>
          {({ onClickToggle }) => (
            <button
              className="button-link navigation-menu-link basket-toggle"
              onClick={onClickToggle}
              disabled={disabledPaths.includes(pathname)}
              type="button"
            >
              <Badge count={basketLength}>
                <i
                  className="fa fa-shopping-bag"
                  style={{ fontSize: "2rem" }}
                />
              </Badge>
            </button>
          )}
        </BasketToggle>
        <ul className="mobile-navigation-menu">
          {user ? (
            <li className="mobile-navigation-item">
              <UserNav />
            </li>
          ) : (
            <>
              {pathname !== SIGNIN && (
                <li className="mobile-navigation-item">
                  <Link
                    className="navigation-menu-link"
                    onClick={onClickLink}
                    to={SIGNIN}
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
      <div className="mobile-navigation-sec">
        <SearchBar />
        <FiltersToggle>
          <button className="button-link button-small" type="button">
            <i className="fa fa-filter" />
          </button>
        </FiltersToggle>
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  isAuthenticating: PropType.bool.isRequired,
  basketLength: PropType.number.isRequired,
  disabledPaths: PropType.arrayOf(PropType.string).isRequired,
  user: PropType.oneOfType([PropType.bool, PropType.object]).isRequired,
};

const Navigation2 = (props) => {
  const { isAuthenticating, basketLength, disabledPaths } = props;
  const { pathname } = useLocation();
  const isProductPage = matchPath(pathname, VIEW_PRODUCT);
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const open = anchorEl ? true : false;

  const shareClicked = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        url: window.location.href,
        title: "Sabiyya Collections",
      });
    }
  }, [navigator, window]);

  const handleToggle = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
    if (event.currentTarget.ariaLabel !== undefined) {
      history.push(event.currentTarget.ariaLabel);
    }
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setAnchorEl(null);
    } else if (event.key === "Escape") {
      setAnchorEl(null);
    }
  }

  return (
    <nav className="mobile-navigation-2">
      {isProductPage && (
        <Link to={HOME}>
          <ArrowBackIosIcon style={{ color: "white" }} />
        </Link>
      )}
      <SearchBar />
      {isProductPage && (
        <button onClick={shareClicked}>
          <ShareIcon style={{ color: "white" }} />
        </button>
      )}
      <button>
        <MoreHorizIcon onClick={handleToggle} style={{ color: "white" }} />
      </button>
      <Popper
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "right top",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={handleClose} aria-label={HOME}>
                    Home
                  </MenuItem>
                  <MenuItem onClick={handleClose} aria-label={SHOP}>
                    Shop
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    aria-label={FEATURED_PRODUCTS}
                  >
                    Featured
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    aria-label={RECOMMENDED_PRODUCTS}
                  >
                    Recommended
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </nav>
  );
};

Navigation2.propTypes = {
  isAuthenticating: PropType.bool.isRequired,
  basketLength: PropType.number.isRequired,
  disabledPaths: PropType.arrayOf(PropType.string).isRequired,
};

export default Navigation2;
