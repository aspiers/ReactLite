import React, { Component } from 'react';
import { observer, inject } from "mobx-react";

import Popover from 'material-ui/Popover/Popover';
import {Menu, MenuItem} from 'material-ui/Menu';

import MoreText from '../../../Components/MoreText'

import {
  ShareButtons,
  generateShareIcon
} from 'react-share';

import './style.css';

const {
  FacebookShareButton,
  TwitterShareButton
} = ShareButtons;


const FacebookIcon = generateShareIcon('facebook')
const TwitterIcon = generateShareIcon('twitter')

@inject("UserStore", "QuestionCommentsStore")
@observer
class Comment extends Component {

  constructor(props) {

    super(props)
    this.state = {
      sharePopover: {
        isOpen: false,
        curAnchorEl: null
      }
    }
    const routeElems = props.RoutingStore.location.pathname.split('/');
    this.route = {
      collectionId: routeElems[2],
      questionIndex: routeElems[4]
    }
  }

  handleSharePopoverOpen = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    const {currentTarget} = event;
    this.setState({
      sharePopover: {
        isOpen: true,
        curAnchorEl: currentTarget
      }
    })
  }

  handleSharePopoverClose = () => {
    this.setState({
      sharePopover: {
        isOpen: false,
        curAnchorEl: null
      }
    });
  }

  clickFB = (e) => {
    document.getElementsByClassName(`fb-network__share-button${this.props.comment.id}`)[0].click()
  }

  clickTwitter = (e) => {
    document.getElementsByClassName(`twitter-network__share-button${this.props.comment.id}`)[0].click()
  }

  changeMyAnswer = () => {
    this.props.history.push(`/survey/${this.route.collectionId}/flow/${this.route.questionIndex}/vote/`)
  }

  render() {
    const { _RoutingStore, comment, UserStore, onDelete, onReport, question } = this.props
    const { question_info, id } = comment

    const shareUrl = `https://app.represent.me/question/${question_info.id}/${question.slug}/comment${id}/`;
    const title = `${comment.user.first_name} ${comment.user.last_name} commented question`

    const fb = (
    <FacebookShareButton
      url={shareUrl}
      quote={title}
      className={`fb-network__share-button${comment.id}`}>
      <FacebookIcon
        size={32}
        round />
    </FacebookShareButton>
  )

    const twitter = (
      <TwitterShareButton
        url={shareUrl}
        title={title}
        className={`twitter-network__share-button${comment.id}`}>
        <TwitterIcon
          size={32}
          round />
      </TwitterShareButton>
    )
    const m_names = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return (
      <div className="comment">
        {/*<Votes />*/}
        <div className="content">
          <div className="comment-data">
            <a className="author">
              <img alt='comment author' src={comment.user.photo} />
              <span className="name">{comment.user.first_name} {comment.user.last_name}</span>
            </a>
            <div className="pull-right">
              <span className="type text-xs">info</span>
              <span className="author-answer text-xs s-agree">Strongly disagree</span>
            </div>
            <div className="comment-text">
              <MoreText text={comment.text}/>
            </div>
          </div>
          <div className="buttons">
           {/*
            <a className="reply">Reply</a>
            <span className="dot"> · </span>
            */}
            <a className="change-answer" onClick={this.changeMyAnswer}>Change my answer</a>
            <span className="dot"> · </span>
            <span className="date">{new Date(comment.modified_at).getDate()} {m_names[new Date(comment.modified_at).getMonth()]}</span>
            <span className="dot"> · </span>
            <a className="report" onClick={onReport} >Report</a>
            <span className="dot"> · </span>
            <a className="share" onClick={this.handleSharePopoverOpen}>Share</a>

            <Popover
              open={this.state.sharePopover.isOpen}
              anchorEl={this.state.sharePopover.curAnchorEl}
              onRequestClose={this.handleSharePopoverClose}
            >
              <Menu>
                <MenuItem primaryText="Share in FB"
                          leftIcon={fb}
                          onClick={this.clickFB}
                />

                <MenuItem primaryText="Share in Twitter"
                          leftIcon={twitter}
                          onClick={this.clickTwitter}
                />
              </Menu>
            </Popover>
            {UserStore.isLoggedIn() && UserStore.userData.get("id") === comment.user.id && (<span>
              <span className="dot"> · </span>
              <a className="delete" onClick={onDelete} >Delete</a>
            </span>)}

          </div>
        </div>
      </div>
    );
  }
}

export default Comment;
