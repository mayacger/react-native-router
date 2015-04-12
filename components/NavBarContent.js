'use strict';

var React = require('react-native');
var tweenState = require('react-tween-state'); // Animate header

var NavButton = require('./NavButton');

var {
  StyleSheet,
  Text,
  View
} = React;


var NavBarContent = React.createClass({

  mixins: [tweenState.Mixin],

  getInitialState: function() {
    return {
      opacity: this.props.willDisappear ? 1 : 0
    };
  },

  goBack: function() {
    if (!this.props.willDisappear) {
      this.props.goBack();
    }
  },

  goForward: function(route) {
    this.props.goForward(route);
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.route !== this.props.route) {
      this.setState({
        opacity: this.props.willDisappear ? 1 : 0
      });

      setTimeout(() => {
        this.tweenState('opacity', {
          easing: tweenState.easingTypes.easeInOutQuad,
          duration: 200,
          endValue: 1
        });
      }, 0);
    }
  },

  render() {
    var transitionStyle = { 
      opacity: this.getTweeningValue('opacity'),
    };

    var leftCorner, rightCorner, titleComponent;
    var leftCornerContent;

    // Set left corner (defaults to "Back"-button for routes with index > 0)
    if (this.props.route.leftCorner) {
      var LeftCorner = this.props.route.leftCorner;
      leftCornerContent = <LeftCorner toRoute={this.goForward} />
    } else if (this.props.route.index > 0) {
      leftCornerContent = <NavButton onPress={this.goBack} backButtonComponent={this.props.backButtonComponent} />
    }

    leftCorner = (
      <View style={[styles.corner, styles.alignLeft]}>
        {leftCornerContent}
      </View>
    );

    // Set rightCorner
    if (this.props.route.rightCorner || this.props.rightCorner) {
      var RightCorner = this.props.route.rightCorner || this.props.rightCorner;
      rightCorner = (
        <View style={[styles.corner, styles.alignRight]}>
          <RightCorner toRoute={this.goForward} />
        </View>
      );
    } else {
      rightCorner = <View style={[styles.corner, styles.alignRight]} />;
    }

    // Set title message
    if (this.props.route.titleComponent) {
      var TitleComponent = this.props.route.titleComponent;
      titleComponent = (
        <View>
          <TitleComponent />
        </View>
      );
    } else {
      titleComponent = (
        <View>
          <Text style={styles.navbarText}>{this.props.route.name}</Text>
        </View>
      )
    }

    return (
      <View style={[styles.navbar, this.props.route.headerStyle, transitionStyle]}>
        {leftCorner}
        {titleComponent}
        {rightCorner}
      </View>
    )
  }
});


var styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64, // Default iOS navbar height
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 13
  },
  navbarText: {
    color: 'white',
    fontSize: 17,
    margin: 10,
    marginTop: 14,
    fontWeight: '600',
    textAlign: 'center',
    alignItems: 'center',
  },
  corner: {
    flex: 1,
    justifyContent: 'center',
  },

  alignLeft: {
    alignItems: 'flex-start'
  },
  alignRight: {
    alignItems: 'flex-end'
  },
  buttonTextLeft: {
    marginLeft: 10,
  },
  buttonTextRight: {
    marginRight: 10
  }
});


module.exports = NavBarContent;