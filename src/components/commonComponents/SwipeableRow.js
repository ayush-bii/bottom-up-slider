import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import AppImages from '../../utils/AppImages';


export default class SwipeableRow extends Component {

    renderRightAction = (text, x, progress) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [x, 0],
        });
        const pressHandler = () => {
            this.close();
            alert(text);
        };
        return (
            <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
                <RectButton
                    style={styles.rightAction}
                    onPress={pressHandler}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={AppImages.pin} />
                    <Text style={styles.actionText}>{text}</Text>
                </RectButton>
            </Animated.View>
        );
    };
    renderRightActions = progress => (
        <View style={{ width: 192, flexDirection: 'row' }}>
            {this.renderRightAction('Follow', 192, progress)}
            {this.renderRightAction('Wish', 128, progress)}
            {this.renderRightAction('Send', 64, progress)}
        </View>
    );
    updateRef = ref => {
        this._swipeableRow = ref;
    };
    close = () => {
        this._swipeableRow.close();
    };
    render() {

        return (
            <Swipeable
                ref={this.updateRef}
                friction={2}
                leftThreshold={0}
                rightThreshold={40}
                renderRightActions={this.renderRightActions}
            >
                <View style={styles.rowContainer}>
                    <View style={styles.row}>
                        <Text style={styles.title}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
                    </View>
                </View>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({

    actionText: {
        color: 'grey',
        fontSize: 14,
        backgroundColor: 'transparent',
        padding: 5,
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    rowContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    row: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 30,
        width: '100%',
        padding: 15,
    },

    title: { textAlign: 'center' },

});
