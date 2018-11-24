import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
//import ReactMarkdown from 'react-markdown';
import {Helmet} from "react-helmet";

import RaisedButton from 'material-ui/RaisedButton';

import MoreText from '../Components/MoreText';
import ErrorReload from '../ErrorReload';
import './CollectionIntro.css';

@inject("UserStore", "CollectionStore")
@observer class CollectionIntro extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collection: null,
      collectionImageLoaded: false,
      networkError: false
    }
  }

  componentWillMount() {
    let { CollectionStore, match } = this.props
    CollectionStore.getCollectionById(parseInt(match.params.collectionId, 10))
      .then((collection) => {
        this.setState({ collection: collection });
      })
    this.props.CollectionStore.getCollectionItemsById(parseInt(match.params.collectionId, 10))
      .then((resolve) => {
      })
      .catch((error) => {
        this.setState({ networkError: true })
      })
  }

  startVoting() {
    const { history, UserStore, location } = this.props;

    const collectionId = parseInt(this.props.match.params.collectionId, 10);
    const url = `/survey/${collectionId}/flow/0/vote/`;

    if(!UserStore.userData.has("id")){
      history.push(
        url,
        { state: { from: location }},
      )
    } else {
      history.push(url);
    }
  };

  render() {

    let collectionId = parseInt(this.props.match.params.collectionId, 10);
    let { collection, networkError } = this.state;

    if(networkError) {
      return <ErrorReload message="We couldn't load this collection!"/>
    }else if(!collection) {
      return null
    }

    /*

      Three separate layers to control the backround image.
      Outermost div = Image
      Middle div = Black while image is loading, then fades to transparent on image load
      Top div = Radial black gradient overlay

      See img with display: none and onLoad() handler to change state once image loads

    */

    let imageStyle = {
      height: '100%',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }

    let outerStyle = { // Defaults no cover photo
      height: '100%',
      color: 'black',
      transition: 'all 0.5s ease-in-out',
    }

    let innerStyle = { // Defaults no cover photo
      height: '100%',
      overflow: 'scroll',
    }

    if(collection.photo) { // Override if cover photo
      outerStyle.backgroundColor = 'rgba(0,0,0,1)';
      if(this.state.collectionImageLoaded) {
        imageStyle.backgroundImage = 'url(' + collection.photo.replace("localhost:8000", "represent.me") + ')';
        outerStyle.backgroundColor = 'rgba(0,0,0,0)';
      }
      outerStyle.color = 'white';
      innerStyle.background = '';
    }

    if(collectionId === 122) {

      outerStyle.backgroundColor = 'rgba(0,0,0,1)';
      if(this.state.collectionImageLoaded) {
        imageStyle.backgroundImage = 'url(/img/Brexitometer.jpg)';
        outerStyle.backgroundColor = 'rgba(0,0,0,0)';
      }
      outerStyle.color = 'white';
      innerStyle.background = '';
    }

    return (
      <div style={imageStyle}>
        <div style={outerStyle}>
          {collection.photo && <img src={collection.photo.replace("localhost:8000", "represent.me")} style={{display: 'none'}} alt="" onLoad={() => {this.setState({collectionImageLoaded: true})}} />}
          <div style={innerStyle} className="imageContainer">
            <div className="contentBox">

                <h1 style={{ maxWidth: '600px', display: '-webkit-inline-box' }}>{ collection.name }</h1>
              {/* <ReactMarkdown source={ collection.desc } className="markDownText" renderers={{Link: props => <a href={props.href} target="_blank">{props.children}</a>}} /> */}
              {collection.desc && <MoreText className="moreText"
                  text={collection.desc || ""}
                  markdownEnabled={true}
                  chars={150}
                  />}
                {collection ?
                  collection.question_count  ?
                    <RaisedButton label="Start" primary onClick={this.startVoting} style={{marginTop: 15}}/>
                    :
                    <div>
                      <div> ---------- </div>
                      <h3 >Sorry,  there are no questions currently in this survey</h3>
                      <Link to='/'><RaisedButton label="back" style={{borderRadius: 5}} /></Link>
                    </div>

                 : null
                }
                {/*this.props.UserStore.userData.has("id") && this.props.CollectionStore.collections.get(collectionId).user.id === this.props.UserStore.userData.get("id") && <Link to={ "/survey/" + collectionId + "/edit" }><RaisedButton label="Edit" primary /></Link>*/}
              </div>
            </div>

        </div>
        {collection ? <OgTags collection={collection} /> : null}
      </div>
    );

  }

}


const OgTags = ({collection}) => {
  const og = {
    url: `${window.location.origin}/survey/${collection.id}`,
    title: `${collection.name}`,
    image: collection.photo || 'http://i.imgur.com/wrW7xwp.png',
    desc: collection.desc || "Have your say!"
  }
  return (<Helmet>
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@representlive" />
    <meta name="twitter:creator" content="@representlive" />
    <meta name="twitter:title" content={og.title} />
    <meta name="twitter:description" content={og.desc} />
    <meta name="twitter:image" content={og.image} />

    <meta property="og:url" content={og.url} />
    <meta property="og:title" content={og.title} />
    <meta property="og:image" content={og.image} />
    <meta property="og:description" content={og.desc} />
    <meta property="og:type" content="website" />
    <meta property="fb:app_id" content="1499361770335561" />
  </Helmet>)
}

export default CollectionIntro;
