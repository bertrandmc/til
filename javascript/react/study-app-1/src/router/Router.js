import React, {Component} from 'react';
import storage from '../services/Storage';

const getCurrentPath = () => {
  const path = document.location.pathname;
  return path.substring(path.lastIndexOf('/'));
}

export class Router extends Component {
  state = {
    route: getCurrentPath()
  }

  static childContextTypes = {
    route: React.PropTypes.string,
    linkHandler: React.PropTypes.func,
    storage: React.PropTypes.object
  }

  getChildContext() {
    return {
      route: this.state.route,
      linkHandler: this.handleLinkClick,
      storage: storage
    };
  }

  handleLinkClick = (route) => {
    this.setState({route});
    history.pushState(null, '', route);
  }

  componentDidMount = () => {
    window.onpopstate = () => {
      this.setState({
        route: getCurrentPath()
      });
    };
  }

  render() {
    return <div>{this.props.children}</div>
  }
}
