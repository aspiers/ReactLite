import React, {Component} from 'react'

import moment from 'moment';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

const style = {
  minHeight: '300px',
  padding: '20px 30px',
  textAlign: 'center' 
}

class QuestionFlowInfo extends Component {

  render() {
    const { question } = this.props;
    return (
      <Paper zDepth={5} style={style}>
        <h1>{ question.question }</h1>
        <h3>{ question.description }</h3>
        <h5>{ moment(question.modified_at).format('DD MMM') }</h5>
        <Author user={question.user} />
        {question.links.map((link) => {
          return (<QuestionLink link={link} />);
        })}
      </Paper>
    )
  }
}

const QuestionLink = ({link}) => {
  return (<div>
    <a href={link.url}>{link.link}</a>
  </div>)
}

const Author = ({user}) => {
  const userName = user.first_name+' '+user.last_name;
  return (<div>
    <Chip>
      <Avatar src={user.photo} />{userName}
    </Chip>
  </div>)
}

export default QuestionFlowInfo;