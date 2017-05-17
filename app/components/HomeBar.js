'use strict';

import React, { PropTypes, } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
	Dimensions,
	Platform
} from 'react-native';

let width = Dimensions.get('window').width;

class HomeBar extends React.Component {

	static propTypes = {
		title: PropTypes.string.isRequired,
		height: PropTypes.number,
		titleColor: PropTypes.string,
		backgroundColor: PropTypes.string,
		onRightButtonPress: PropTypes.func,
		navigator: PropTypes.object,

	};

	static defaultProps = {
		height: 48,
		titleColor: '#fff',
		backgroundColor: '#1983d1',
	};

	_renderRightView() {
		if (this.props.rightView) {
			return this.props.rightView();
		}
		return null;
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
			<View style={[styles.container, {
				height: height,
				backgroundColor: this.props.backgroundColor,
			}]}>
				<View style={{
					height: title_height,
					backgroundColor: this.props.backgroundColor,
					marginTop: iosTop,
					flexDirection: 'row',
					width: width,
				}}>
					<View style={styles.leftButton}>
					</View>
					<View style={styles.title}>
						<Text style={[styles.titleText, { color: this.props.titleColor }]} numberOfLines={1}>
							{this.props.title}
						</Text>
					</View>
					<TouchableOpacity onPress={this._onRightButtonPressHandle.bind(this)}>
						<View style={[styles.rightButton,{
							height: title_height,
						}]}>
							{this._renderRightView()}
						</View>
					</TouchableOpacity>

				</View>
			</View>
		);
	}
};



export default HomeBar;

let styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		width: width,
		elevation: 5,
	},
	leftButton: {
		width: 40,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginLeft: 8,
	},
	title: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	titleText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	rightButton: {
		width: 40,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8,
	},
});
