import React from 'react';
import { observer, inject } from "mobx-react";
import {Helmet} from "react-helmet";
import RaisedButton from 'material-ui/RaisedButton';
//import smallLogo from './represent_white_outline.svg';

import './CollectionsList.css';



const CollectionsList = inject("CollectionStore", "UserStore")(observer(({ CollectionStore, UserStore, history }) => {

  if (CollectionStore.collections.size <= 0) {
    return null;
  }

  return (
    <div>
      <div>
        <div className="imageContainer"
             style={{
               background: 'url(/img/Brexitometer.png) no-repeat center',
               padding: '1% 10% 38% 10%'
             }} >
          <div className="contentBox">

            <h1 style={{ width: '80%', display: '-webkit-inline-box' }}>
              What do <em>you</em> think about Brexit?
            </h1>

            <p>
              Take a short quiz to find out whether your views on Brexit
              match up with other people's.
            </p>

            <p>
              You may be surprised by the results!
            </p>

            <RaisedButton
              label="Start"
              primary
              href="/survey/149/flow/0/vote/"
              style={{marginTop: 15}}
              />

          </div>
        </div>

      </div>
      <OgTags />
    </div>
  );
}))

const OgTags = () => {
  const og = {
    url: window.location.origin,
    title: "Let's build a better democracy",
    image: 'http://i.imgur.com/wrW7xwp.png',
    desc: "Have your say!"


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
    <meta property="og:type" content="website" />
    <meta property="fb:app_id" content="1499361770335561" />
    <meta property="og:description" content={og.desc} />
  </Helmet>)
}

export default CollectionsList;
