import React from 'react';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionSearch from '../CollectionSearch';
import {Helmet} from "react-helmet";
import RaisedButton from 'material-ui/RaisedButton';
//import smallLogo from './represent_white_outline.svg';

import './CollectionsList.css';



const CollectionsList = inject("CollectionStore", "UserStore")(observer(({ CollectionStore, UserStore, history }) => {

  if (CollectionStore.collections.size <= 0) {
    return null;
  }

  let collections = CollectionStore.collections.entries();

  return (
    <div>


 {!UserStore.isLoggedIn() && <div className="aboutus clear">

    <h2><strong> Represent believes a more effective democracy is within reach </strong></h2>

    <div  className="aboutus_right">

      <img src="https://i1.wp.com/represent.me/wp-content/uploads/results.gif" alt="chatbot" />

    </div>

    <div  className="aboutus_left">


    <p><strong>
      Represent gives your views and values a voice.
      </strong>
    </p>
    <p>
      One central place to vote on the issues and work with the politicians and groups you trust to represent you.
    </p>
    <p>
      Represent is free, open to everyone, anonymous and secure.

      We are your trusted partner, making our combined voices more powerful and effective
      to create the world we want.
    </p>






    <p>
     <RaisedButton label="Sign Up" onClick={() => history.push('/login')} style={{marginRight: 10}}/>
     <RaisedButton label="Features" primary={true} href="https://represent.me/features/" target="_blank"  />
    </p>

    </div>
 </div>}



        <div>
           <div className="imageContainer"  style={{background: 'url(https://images.unsplash.com/photo-1488229297570-58520851e868?dpr=1&auto=format&fit=crop&w=1000&h=500&q=60)', backgroundSize: 'cover', backgroundPosition: '50% 50%', padding: '70px 0 90px 0'}} >
            <div className="contentBox">

                <h1 style={{ maxWidth: '600px', display: '-webkit-inline-box' }}>Did you get what you wanted from the election?</h1>

                <p>Well that was fun. How was it for you?</p>

                <RaisedButton label="Start" primary href="/survey/132/flow/0/vote/" style={{marginTop: 15}}/>

              </div>
            </div>

        </div>






      <div><CollectionSearch /></div>
      <div className='containerStyles'>
      {collections.map((collection_obj) => {
        const id = collection_obj[0];
        const collection = collection_obj[1];

        // const first_name = collection.user.first_name ? collection.user.first_name : '';
        // const last_name = collection.user.last_name ? collection.user.last_name : '';
        // const user_name = `${first_name} ${last_name}`;
        // const bio = collection.user.bio ? collection.user.bio : '';
        // const location = collection.user.country_info ? collection.user.country_info.name : '';
        // const randomPic = `./img/pic${Math.floor(Math.random()*7)}.png`;
        //const photo = collection.user.photo ? collection.user.photo.replace("localhost:8000", "represent.me") : randomPic;
        const image = collection.photo ? collection.photo.replace("localhost:8000", "represent.me") : null;
        //const link = "https://app.represent.me/profile/" + collection.user.id + "/" + collection.user.username; //our user
        //const subtitle = `${bio.substring(0, location ? 77-location.length : 77)}${bio && '...'} ${location}`

        return (

            <Card className='cardStyles' key={ id }>

            <Link to={ "/survey/" + id } >
               {/* <CardHeader
                    title={user_name}
                    subtitle={subtitle}
                    avatar={photo}
                    className='cardHeaderStyle'
                />
              */}

                <CardMedia>
                  <img src={image} className='imgStyle'/>
                </CardMedia>
                <CardTitle
                  className='cardTitle'
                  title={ collection.name }
                />
              </Link>
              <CardText style={{wordWrap: 'break-word'}} className='cardText'>

              <div style={{margin:'0 0 3px 0', fontSize: 11, color: '#999'}}>{collection.question_count} questions</div>
              {collection.desc ?
                <div>
                  {collection.desc.slice(0, 100 + collection.desc.indexOf(' ')) + ' '}
                  <Link to={ "/survey/" + id }><i>more...</i></Link>
                </div>
                : null}
              </CardText>

              <CardActions>
                <Link to={ "/survey/" + id }>
                  <FlatButton label="Start" primary />
                 </Link>
              </CardActions>

            </Card>

        )
      })}
      </div>
      <OgTags />
    </div>
  );
}))

const OgTags = ({}) => {
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
