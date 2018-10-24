import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import classNames from 'classnames';

import Fade from '@material-ui/core/Fade';

import PropTypes from 'prop-types';
import Menu from './Header/Menu';
import AppBarIcons from './Header/AppBarIcons';
import SearchBar from './Search/SearchBar';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import Logo from './Header/Logo'
import Grid from '@material-ui/core/Grid';
import mapStateToProps from '../store/defaultMapStateToProps';
import mapDispatchToProps from '../store/defaultMapDispatchToProps';
import withWidth from '@material-ui/core/withWidth';
// import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';


const _drawerWidth = Math.max(
    window.innerWidth < 800 ? parseInt(window.innerWidth * 0.4, 10) : parseInt(window.innerWidth * 0.25, 10),
    150
);

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: "100%",
        zIndex: 1,
        overflow: 'hidden',
        display: 'flex',
        maxHeight: '100vh',
        position: 'relative',
        width: '100%',
    },
    appBar: {
        position: 'absolute',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.default
    },
    appBarShift: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    mobileToolbar: {
        textAlign: "center"
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing.unit * 3,
        paddingTop: theme.spacing.unit * 3 * 3,
        minWidth: 0, // So the Typography noWrap works,
        minHeight: `calc(100vh - ${theme.spacing.unit * 3 * 4}px)`,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        position: "relative",
        overflow: "scroll",
        maxHeight: '100vh',
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'contentShift-left': {
        marginLeft: 0,
    },
    noPadding: {
        padding: `${theme.spacing.unit * 3 * 3}px 0px 0px 0px`
    },
    searchBar: {
        height: "52px",
        display: "flex",
        justifyContent: 'center'
    },
    menuGridDiv: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'left',
        [theme.breakpoints.only('xs')]: {
            minHeight: 52,
            justifyContent: 'space-evenly',
        },
    },
    menuGridDivDrawer: {
        display: 'flex',
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'space-evenly',
        }
    },
    toolbar: {
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        [theme.breakpoints.only('xs')]: {
            paddingLeft: 0,
            paddingRight: 0,
        }
    },
    shiftMainDown: {
        paddingTop: theme.spacing.unit * 3 * 4
    }
});

class Container extends Component {

    state = { drawerWidth: _drawerWidth }

    // root = null;
    // main = null;

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        // clearAllBodyScrollLocks();
    }

    handleResize = () => {
        const drawerWidth = this.props.clientType === "extension" ? 250 : Math.max(
            window.innerWidth < 800 ? parseInt(window.innerWidth * 0.4, 10) : parseInt(window.innerWidth * 0.25, 10),
            150
        );
        this.setState({
            drawerWidth
        })
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.props.clientType === "extension" && this.handleResize();
        // this.root = document.querySelector('#root');
        // this.main = document.querySelector('#main-metada');
        // console.log(this.main, this.root);
        // disableBodyScroll(this.main);
        // enableBodyScroll(this.main);
    }

    goHome = () => {
        this.props.history.push('/');
    }

    render() {
        const { classes, children, clientType, data, dataIsAvailable,
            history, isRehydrated, show, match, isMain,
            toggleIssue, toggleHelp, translate, updateEntityInfoBox, isGraph, width } = this.props;

        const isMobile = clientType === 'mobile';
        const location = history.location.pathname.split('/')[1];
        const titleLoc = location ? location : 'search';
        const showSearchBar = isRehydrated && !(isMain && show.mainSearchBar) && !(isGraph && show.drawer && width === "xs");
        // const isLarge = ["xl", "lg", "md"].indexOf(width) > -1;

        return (
            <div className={classes.root}>
                <Helmet>
                    <title>Metada - {this.props.translate('home.menu.' + titleLoc)}</title>
                </Helmet>
                <AppBar
                    className={classNames(
                        classes.appBar,
                        {
                            [classes.appBarShift]: isRehydrated && show.drawer && isGraph,
                        }
                    )}
                    position="absolute"
                    style={{
                        marginLeft: isRehydrated && show.drawer && isGraph ? this.state.drawerWidth : 'unset',
                        width: isRehydrated && show.drawer && isGraph ? `calc(100% - ${this.state.drawerWidth}px)` : '100%',
                    }}
                >
                    <Toolbar className={classes.toolbar}>
                        <Menu
                            history={history}
                            clientType={clientType}
                            show={show}
                            isRehydrated={isRehydrated}
                            translate={translate}
                            isGraph={isGraph}
                        />
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid
                                item
                                className={classNames(classes.menuGridDiv, show.drawer && classes.menuGridDivDrawer)}
                                xs={12}
                                sm={show.drawer && isGraph ? 12 : 6}
                                md={show.drawer && isGraph ? 5 : 4}
                            >

                                <Logo
                                    color="inherit"
                                    aria-haspopup="true"
                                    onClick={this.goHome}
                                    clientType={clientType}
                                    show={show}
                                    isRehydrated={isRehydrated}
                                />

                                <AppBarIcons
                                    toggleHelp={toggleHelp}
                                    toggleIssue={toggleIssue}
                                    isGraph={Boolean(isGraph)}
                                    width={width}
                                    show={show}
                                />
                            </Grid>
                            <Fade in={showSearchBar} timeout={250} unmountOnExit={width === "xs"} mountOnEnter={width === "xs"}>
                                <Grid item xs={12} sm={show.drawer && isGraph ? 12 : 5} md={show.drawer && isGraph ? 5 : 4}>
                                    <div>
                                        {dataIsAvailable && <div className={classes.searchBar}><SearchBar
                                            data={data}
                                            show={show}
                                            history={history}
                                            match={match}
                                            isGraph={isGraph}
                                            translate={translate}
                                            preventAutofocus={true}
                                            updateEntityInfoBox={updateEntityInfoBox}
                                            controlStyle={{
                                                margin: 'auto',
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}
                                        /></div>}
                                    </div>
                                </Grid>
                            </Fade>

                        </Grid>
                    </Toolbar>
                </AppBar>
                {this.props.drawer}
                <main
                    className={classNames(
                        classes.content,
                        {
                            [classes.contentShift]: isGraph && show.drawer,
                            [classes["contentShift-left"]]: isGraph && show.drawer,
                        },
                        isMobile && classes.noPadding,
                        showSearchBar && width === "xs" && classes.shiftMainDown
                    )}
                    style={{
                        overflow: isGraph ? 'hidden' : 'scroll',
                        marginLeft: isRehydrated && isGraph ? show.drawer ? "0px" : -this.state.drawerWidth : "0px",
                        width: isRehydrated && show.drawer && isGraph ? `calc(100% - ${this.state.drawerWidth}px)` : '100%',
                    }}
                    id="main-metada"
                >
                    {children}
                </main>
            </div>
        )
    }
}

Container.propTypes = {
    classes: PropTypes.object.isRequired,
};

const _Container = connect(mapStateToProps, mapDispatchToProps)(Container);

export default withWidth()(withStyles(styles)(_Container));
