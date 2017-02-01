import React, {Component} from 'react';

export class Link extends Component {
  static contextTypes = {
    route: React.PropTypes.string,
    linkHandler: React.PropTypes.func
  }

  handleClick = (event) => {
    event.preventDefault();
    this.context.linkHandler(this.props.to);
  }

  render() {
    const {to} = this.props;
    const activeClass = this.context.route === to ? 'active' : '';
    return <a className={activeClass} href="#" onClick={this.handleClick}>{this.props.children}</a>
  }
}

Link.propTypes = {
  to: React.PropTypes.string.isRequired
};
