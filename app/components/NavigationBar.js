'use strict';

import React, { PropTypes, } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
	Dimensions,
	Platform,
	TouchableNativeFeedback
} from 'react-native';
const iconLeft = require('../assets/back-icon.png');
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 40;
let width = Dimensions.get('window').width;

class NavigationBar extends React.Component {

	static propTypes = {
		title: PropTypes.string.isRequired,
		height: PropTypes.number,
		titleColor: PropTypes.string,
		backgroundColor: PropTypes.string,
		leftButtonTitle: PropTypes.string,
		leftButtonTitleColor: PropTypes.string,
		onLeftButtonPress: PropTypes.func,
		rightButtonTitle: PropTypes.string,
		rightButtonTitleColor: PropTypes.string,
		onRightButtonPress: PropTypes.func,
		navigator: PropTypes.object,

	};

	static defaultProps = {
		height: 48,
		titleColor: '#fff',
		backgroundColor: '#1983d1',
		leftButtonTitle: null,
		leftButtonTitleColor: '#fff',
		rightButtonTitle: null,
		rightButtonTitleColor: '#fff',
		leftButtonIcon: iconLeft
	};

	_renderLeftIcon() {
		if (this.props.leftButtonIcon) {
			return (
				<Image style={styles.icon} resizeMode={'contain'} source={this.props.leftButtonIcon} />
			);
		}
		return null;
	}

	_renderRightIcon() {
		if (this.props.rightButtonIcon) {
			return (
				<Image style={styles.rightButtonIcon} source={this.props.rightButtonIcon} />
			);
		}
		return null;
	}
	_renderRightView() {
		if (this.props.rightView) {
			return this.props.rightView();
		}
		return null;
	}

	_onLeftButtonPressHandle(event) {
		let onPress = this.props.onLeftButtonPress;
		if (onPress) {
			typeof onPress === 'function' && onPress(event);
		} else {
			if (this.props.navigator) {
				this.props.navigator.goBack();
			}
		}

	}

	_onRightButtonPressHandle(event) {
		let onPress = this.props.onRightButtonPress;
		typeof onPress === 'function' && onPress(event);
	}

	render() {
		let iosTop = Platform.OS === 'ios' ? 20 : 0;
		let title_height = Platform.OS === 'ios' ? 44 : 48;
		let height = title_height + iosTop;

		return (
			<View style={[styles.container, { backgroundColor: this.props.backgroundColor }]}>
				<View style={{
					backgroundColor: this.props.backgroundColor,
					flexDirection: 'row',
					width: width,
				}}>

					<TouchableNativeFeedback
						accessibilityComponentType="button"
						accessibilityTraits="button"
						delayPressIn={0}
						pressColor={'rgba(0, 0, 0, .32)'}
						borderless
						onPress={this._onLeftButtonPressHandle.bind(this)}>
						<View style={styles.leftButton}>
							{this._renderLeftIcon()}
							<Text style={[styles.leftButtonTitle, { color: this.props.leftButtonTitleColor }]}>
								{this.props.leftButtonTitle}
							</Text>
						</View>
					</TouchableNativeFeedback>

					<View style={styles.title}>
						<Text style={[styles.titleText, { color: this.props.titleColor }]} numberOfLines={1}>
							{this.props.title}
						</Text>
					</View>

					<TouchableOpacity onPress={this._onRightButtonPressHandle.bind(this)}>
						<View style={styles.rightButton}>
							{this._renderRightView()}
							{this._renderRightIcon()}
							<Text style={[styles.rightButtonTitle, { color: this.props.rightButtonTitleColor }]}>
								{this.props.rightButtonTitle}
							</Text>
						</View>
					</TouchableOpacity>

				</View>
			</View>
		);
	}
};



export default NavigationBar;

let styles = StyleSheet.create({
	container: {
		paddingTop: STATUSBAR_HEIGHT,
		backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
		height: STATUSBAR_HEIGHT + APPBAR_HEIGHT,
		shadowColor: 'black',
		shadowOpacity: 0.1,
		shadowRadius: StyleSheet.hairlineWidth,
		shadowOffset: {
			height: StyleSheet.hairlineWidth,
		},
		elevation: 4,
	},
	leftButton: {
		width: 58,
		flexDirection: 'row',
		alignItems: 'center',
	},
	leftButtonIcon: {
		width: 24,
		height: 24,
		marginLeft: 8,
		marginRight: 8,
	},
	leftButtonTitle: {
		fontSize: 15
	},
	title: {
		flex: 1,
		justifyContent: 'center',
		overflow: 'hidden',
		alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start',
	},
	titleText: {
		fontSize: Platform.OS === 'ios' ? 17 : 18,
		fontWeight: Platform.OS === 'ios' ? '600' : '500',
		color: 'rgba(0, 0, 0, .9)',
		textAlign: Platform.OS === 'ios' ? 'center' : 'left',
		marginHorizontal: 16,
		marginLeft:0,
	},
	rightButton: {
		flex: 1,
		width: 80,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginRight: 8,
	},
	rightButtonIcon: {
		width: 10,
		height: 15
	},
	rightButtonTitle: {
		fontSize: 17
	},
	icon: Platform.OS === 'ios'
		? {
			height: 20,
			width: 12,
			marginLeft: 10,
			marginRight: 22,
			marginVertical: 12,
			resizeMode: 'contain',
		}
		: {
			height: 24,
			width: 24,
			margin: 16,
			resizeMode: 'contain',
			tintColor: '#fff'
		},
	iconWithTitle: Platform.OS === 'ios'
		? {
			marginRight: 5,
		}
		: {},
});
