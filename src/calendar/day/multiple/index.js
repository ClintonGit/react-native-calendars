import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  View
} from 'react-native';
import PropTypes from 'prop-types';

import {shouldUpdate} from '../../../component-updater';

import styleConstructor from './style';

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }

  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['state', 'children', 'marking', 'onPress', 'onLongPress']);
  }

  renderDots(marking) {
    const baseDotStyle = [this.style.dot, this.style.visibleDot];
      console.warn(marking.image);


    if (marking.multi && Array.isArray(marking.multi) && marking.multi.length > 0) {
      // Filter out dots so that we we process only those items which have key and color property
      const validDots = marking.multi.filter(d => (d && d.color || d.image || d.path));
      console.warn(validDots);
      return validDots.map((dot, index) => {
            if(dot.image){
                console.warn("OK");
                return (
                        <Image style={{width:20,height:20,position:"absolute",top:0,right:-40}}
                               source={{uri:dot.path}}
                        />
                );
            }else {
                return (
                    <View key={dot.key ? dot.key : index} style={[baseDotStyle,
                        {backgroundColor: marking.selected && dot.selectedDotColor ? dot.selectedDotColor : dot.color}]}
                    />
                );
            }

      });
    }
    return;
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];

    const marking = this.props.marking || {};
    const dot = this.renderDots(marking);

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);
      if (marking.selectedColor) {
        containerStyle.push({backgroundColor: marking.selectedColor});
      }
    } else if (typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled') {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }

      if (marking.sunday) {
          textStyle.push(this.style.sundaytext);
      }

      if (marking.event) {
          textStyle.push(this.style.eventtext);
      }


    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}>
        <Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text>
        <View style={{flexDirection: 'column',marginTop:-20,marginLeft:-30}}>{dot}</View>
      </TouchableOpacity>
    );
  }
}

export default Day;
