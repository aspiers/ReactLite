import React, { Component } from 'react';
import { Switch } from 'react-router';
import { inject, observer } from "mobx-react";
import { observable } from 'mobx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Scrollbars } from 'react-custom-scrollbars';
// import DevTools from 'mobx-react-devtools';
import { MatchMediaProvider } from 'mobx-react-matchmedia';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import Face from 'material-ui/svg-icons/action/face';
import Avatar from 'material-ui/Avatar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { white, cyan600, grey700 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import CollectionsList from '../CollectionsList';
import CollectionIntro from '../CollectionIntro';
//import CollectionEnd from '../CollectionEnd';

import EndScreen from '../EndScreen';

import EditCollection from '../EditCollection';
import SurveyFlow from '../SurveyFlow';
import CreateCollection from '../CreateCollection';
import Login from '../Login';
import JoinGroup from '../JoinGroup';
import Join from '../Join';
import Test from '../Test';
import UndividedRender from '../UndividedRender';
import AuthCode from '../AuthCode';
import QuestionLiquidDisplay from '../charts/QuestionLiquidPiechart/QuestionLiquidDisplay';
import CollectionCharts from '../charts/CollectionCharts';
import DynamicConfigService from '../../services/DynamicConfigService';
import DynamicConfigEditor from '../DynamicConfigEditor';

import RegisterNewUser from '../RegisterNewUser';
import RegisterPage from '../RegisterNewUser/RegisterNewPage2';

import CandidateIntro from '../CandidateIntro';
import CandidateNew from '../CandidateNew';
import IntroCarousel from '../IntroCarousel';

import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

// import CompareUsers from '../EndScreen/partials/CompareUsersComponent';
// import CompareUsersDetails from '../EndScreen/partials/CompareUsersDetailsComponent';

import AuthTokenComponent from '../AuthTokenComponent'

import Drawer from 'material-ui/Drawer';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import Share from 'material-ui/svg-icons/social/share';
import Close from 'material-ui/svg-icons/navigation/close';

import './Shell.css';

import {
  Router,
  Route,
} from 'react-router-dom'

import {
  ShareButtons,
  generateShareIcon
} from 'react-share';

const {
  FacebookShareButton
} = ShareButtons;


const FacebookIcon = generateShareIcon('facebook')

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: white,
    alternateTextColor: '#1B8AAE',
  },
  slider: {
    selectionColor: '#1B8AAE',
    rippleColor: cyan600,
  },
  raisedButton: {
    textColor: white,
  },
  flatButton: {
    primaryTextColor: cyan600,
    secondaryTextColor: grey700,
  },
  datePicker: {
    textColor: white,
    color: cyan600,
    selectTextColor: white
  },
  checkbox: {
    checkedColor: cyan600
  }
});

const styles = {
  avatarStyle: {
    height: '16px',
    width: '16px',
    margin: '3px 0px'
  },
  leftIconStyle: {
    height: '20px'
  },
  pageWraperStyle: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    overflow: 'hidden'
  },
  appBarStyles: {
    style: {
      height: '24px',
      padding: 0,
    },
    iconStyleLeft: {
      margin: '2px 4px'
    },
    iconStyleRight: {
      marginRight: '8px',
      marginTop: '0',
    },
    titleStyle: {
      margin: 0,
      lineHeight: '24px',
      fontSize: '16px',
      height: '24px',
      textAlign: 'center'
    }
  }
}



@inject("UserStore",  "QuestionStore")
@observer
export default class Shell extends Component {

  constructor(props) {
    super(props)

    this.state = {
      modalOpened: false,
      open: false
    };
    this.dynamicConfig = DynamicConfigService;
    this.onLogout = this.onLogout.bind(this)
    this.navigateToLogin = this.navigateToLogin.bind(this)

    this.breakpoints = observable({
      sm: '(max-width: 900px)',
      lg: '(min-width: 901px)',
    });

  }
  componentWillMount(){
    //if generalAnalyticsData is not loaded, load it into UserStore
    if (!this.props.UserStore.generalAnalyticsData.analytics_os){
      this.props.UserStore.getGeneralAnalyticsData();
    }
  }

  countShare = () => {
    if (!!this.props.UserStore.userData.get('id')){
      this.props.UserStore.countShareClicks({
        analytics_interface: 'collection',
        url: `${window.location.origin}`
      })
    }
  }

  onLogout() {
    this.props.UserStore.logout()
  }

  navigateToLogin() {
    this.props.history.push('/login/' + this.dynamicConfig.getNextConfigWithRedirect(this.props.history.location.pathname))
  }

  navigateToRoot() {
    //e.preventDefault();
    this.props.history.push('/' + this.dynamicConfig.getNextConfigWithRedirect(this.props.history.location.pathname))
  }

  toggleIntro = () => {
    //e.preventDefault()
    const modalOpened = !this.state.modalOpened;
    this.setState({modalOpened})
  }

  clickFB = (e) => {
    document.getElementsByClassName(`fb-network__share-button`)[0].click();
    this.countShare();
  }

  handleToggle = () => this.setState({open: !this.state.open});


  render() {
    const raw_config = this.dynamicConfig.getDynamicConfig(this.props.history.location.pathname);
    if(raw_config) {
      this.dynamicConfig.setConfigFromRaw(raw_config)
    }

    let split_pathname = this.props.history.location.pathname.split("/");

    let mainContentStyle = {
      height: "100%",
      position: "relative",
      boxSizing: "border-box",
      paddingBottom: "28px",
      paddingLeft: this.breakpoints.lg ? "256px" : 0
    }

    if(split_pathname[1] === 'joingroup' || split_pathname[1] === 'undividedrender') {
      mainContentStyle.height = "100%";
    }

    const {
      avatarStyle,
      pageWraperStyle,
      appBarStyles: { style, iconStyleLeft, iconStyleRight, titleStyle }
    } = styles

    const { userData } = this.props.UserStore
    const userId = userData.get('id')
    const username = userData.get('username')
    const photo = userData.get('photo')

    const isAuthenticated = !!userData.get('id')

    const avatar = (
      <IconButton className="headerface"><Avatar style={avatarStyle}
        className="appAvatar"
        icon={!this.props.UserStore.userData.has("id") ? <Face /> : null}
        src={this.props.UserStore.userData.has("photo") ? photo.replace("localhost:8000", "represent.me") : null}
        backgroundColor={cyan600}
        onClick={!isAuthenticated ? this.navigateToLogin : null}
      /></IconButton>
    )

    return(
      <Router history={this.props.history}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <MatchMediaProvider breakpoints={this.breakpoints}>
              <div style={pageWraperStyle}>
                <div style={mainContentStyle}>

                  {split_pathname[1] !== 'joingroup' &&
                    <div>
                      <AppBar
                      className="appBar"
                        iconElementLeft={
                          <IconButton style={{height: 20, width: 20, border: 'none', position: 'relative', top: 0, left: 0, cursor: 'pointer', display: this.breakpoints.lg ? 'none' : 'initial'}}
                            iconStyle={{fill: cyan600, position: 'absolute', height: 20, width: 20, top: 0, left: 0}}>
                            <MenuIcon />
                          </IconButton>}
                        onLeftIconButtonTouchTap={this.handleToggle}


                        iconElementRight={
                          <span>
                            { isAuthenticated ? (
                                <IconMenu
                                  iconButtonElement={
                                    avatar
                                  }
                                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                  targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                >
                                  <MenuItem primaryText="Edit profile" href="https://app.represent.me/me/edit/main/"/>
                                  <MenuItem primaryText="View my profile" href={`https://app.represent.me/profile/${userId}/${username}/`}/>
                                  <Divider />
                                  <MenuItem primaryText="Logout" onClick={this.onLogout}/>
                                </IconMenu> ) : (
                                  avatar
                                )
                          }
                          </span>
                        }
                        style={style}
                        iconStyleLeft={iconStyleLeft}
                        iconStyleRight={iconStyleRight}
                        titleStyle={titleStyle}
                        />
                    </div>
                  }

                  <div>



                  <Drawer
                    open={(this.breakpoints.sm && this.state.open) || !!this.breakpoints.lg}
                    docked={!!this.breakpoints.lg}
                    width={256}
                    onRequestChange={(open) => this.setState({open})}
                  >
                    <List style={{paddingTop: 0}}>
                    <h1 onTouchTap={() => this.navigateToRoot()} className="replogo">
                      <img src="/img/long-100.gif" alt="Represent.me" height="40" />
                      Represent
                    </h1>

                    <ListItem key='menuItem-2' primaryText="What's this?" leftIcon={<RemoveRedEye />} onTouchTap={() => this.toggleIntro()} />
                    <ListItem key='menuItem-3' primaryText="Share" leftIcon={<Share />} onTouchTap={this.clickFB} />
                  </List>
                  <Divider />
                  {this.breakpoints.sm && <ListItem primaryText="Close menu" leftIcon={<Close />} onTouchTap={this.handleToggle} />}


                  </Drawer>
                </div>




                  <IntroCarousel
                    modalOpened={this.state.modalOpened}
                    toggleIntro={this.toggleIntro}/>
{/*(this.breakpoints.lg ? 'calc(100% - 256px)' : '100%')*/}
                  <Scrollbars autoHide style={{float: 'right', width: '100%' }}>
                    <ReactCSSTransitionGroup
                      transitionName="QuestionFlowTransition"
                      transitionEnterTimeout={1000}
                      transitionLeaveTimeout={1000}>
                      {/*}<Links/>*/}
                      <Switch>
                        <Route exact path="/candidate" component={CandidateIntro}/>
                        <Route exact path="/candidate/new/:email" component={CandidateNew}/>
                        <Route exact path="/login/:dynamicConfig?" component={RegisterNewUser}/>
                        <Route exact path="/authcode/:code/:email/:redirect" component={AuthCode}/>
                        <Route exact path="/login/:dynamicConfig/:email" component={RegisterNewUser}/>
                        <Route exact path="/loginuser/:dynamicConfig" component={Login}/>
                        <Route exact path="/loginuser/:dynamicConfig/:email" component={Login}/>
                        <Route exact path="/register" component={RegisterPage}/>
                        <Route exact path="/register/:redirect" component={RegisterPage}/>
                        <Route exact path="/join/:dynamicConfig?" component={Join}/>
                        <Route exact path="/joingroup/:groupId" component={JoinGroup}/>
                        <Route exact path="/joingroup/:groupId/:redirect" component={JoinGroup}/>
                        <Route exact path="/survey/create" component={CreateCollection}/>
                        <Route exact path="/survey/:collectionId/:dynamicConfig?" component={CollectionIntro}/>
                        <Route exact path="/edit/:collectionId" component={EditCollection}/>
                        <Route exact path="/survey/:surveyId/flow/:itemNumber/:activeTab/:dynamicConfig?" component={SurveyFlow}/>
                        {/* <Route exact path="/survey/:collectionId/end/:dynamicConfig?" component={CollectionEnd}/> */}
                        <Route exact path="/survey/:collectionId/end2/:dynamicConfig?" component={EndScreen}/>
                        <Route exact path="/test" component={Test}/>
                        <Route exact path="/undividedrender/:questionId" component={UndividedRender}/>
                        <Route exact path='/charts/pie/question/:questionId' component={QuestionLiquidDisplay}/>
                        <Route exact path='/charts/pie/collection/:collectionId' component={CollectionCharts}/>
                        <Route exact path='/authtoken/:authtoken/:dynamicConfig' component={AuthTokenComponent}/>
                        {/* <Route exact path="/:dynamicConfig?" component={CollectionsList}/> */}
                        {/* <Route exact path='/compare' component={CompareUsers}/>
                        <Route exact path='/compare/:userId' component={CompareUsersDetails}/> */}
                        <Route exact path="/builder" component={DynamicConfigEditor}/>
                        <Route exact path="/:dynamicConfig?" component={CollectionsList}/>
                      </Switch>
                    </ReactCSSTransitionGroup>
                  </Scrollbars>
                </div>
                {/*<DevTools />*/}
                </div>
                {/* Hidden fb share button to make share button in left nav possible */}
                <FacebookShareButton
                  style={{display: 'none'}}
                  url={window.location.origin}
                  quote={`Represent helps you modernise democracy. Compare the policies. Find your match. Make it work for you.`}
                  className='fb-network__share-button'>
                  <FacebookIcon
                    size={32}
                    round />
                </FacebookShareButton>
            </MatchMediaProvider>
          </MuiThemeProvider>
      </Router>

    )
  }

};
