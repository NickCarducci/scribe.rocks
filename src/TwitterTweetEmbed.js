import React, { Component } from "react";
import PropTypes from "prop-types";
import ExecutionEnvironment from "exenv";

export default class TwitterTweetEmbed extends Component {
  static propTypes = {
    /**
     * Tweet id that needs to be shown
     */
    tweetId: PropTypes.string.isRequired,
    /**
     * Additional options to pass to twitter widget plugin
     */
    options: PropTypes.object,
    /**
     * Placeholder while tweet is loading
     */
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /**
     * Function to execute after load, return html element
     */
    onLoad: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
    this.tw = React.createRef();
  }

  renderWidget() {
    const { onLoad, style } = this.props;
    if (!window.twttr) {
      console.error(
        "Failure to load window.twttr in TwitterTweetEmbed, aborting load."
      );
      return;
    }
    if (!this.isMountCanceled) {
      window.twttr.widgets
        .createTweet(this.props.tweetId, this.tw.current, this.props.options)
        .then((element) => {
          this.setState({
            isLoading: false,
            style
          });
          if (onLoad) {
            onLoad(element);
          }
        });
    }
  }

  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      let script = require("scriptjs");
      script("https://platform.twitter.com/widgets.js", "twitter-embed", () => {
        this.renderWidget();
      });
    }
  }

  componentWillUnmount() {
    this.isMountCanceled = true;
  }

  render() {
    const { style } = this.state;
    return <div ref={this.tw} style={style} />;
  }
}
