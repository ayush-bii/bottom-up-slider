import React, { Component } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import {
    PanGestureHandler,
    NativeViewGestureHandler,
    State,
    TapGestureHandler,
} from 'react-native-gesture-handler';

import AppStyles from '../../utils/AppStyles';






export class BottomSheet extends Component {
    masterdrawer = React.createRef();
    drawer = React.createRef();
    drawerheader = React.createRef();
    scroll = React.createRef();
    constructor(props) {
        super(props);




        this.state = {
            snap_points_from_top: this.props.snap_points_from_top || [0, 100, Dimensions.get('window').height - Dimensions.get('window').height / 3],
            lastSnap: 100,
        };

        this._lastScrollYValue = 0;
        this._lastScrollY = new Animated.Value(0);
        this._onRegisterLastScroll = Animated.event(
            [{ nativeEvent: { contentOffset: { y: this._lastScrollY } } }],
            { useNativeDriver: true }
        );
        this._lastScrollY.addListener(({ value }) => {
            this._lastScrollYValue = value;
        });

        this._dragY = new Animated.Value(0);
        this._onGestureEvent = Animated.event(
            [{ nativeEvent: { translationY: this._dragY } }],
            { useNativeDriver: true }
        );

        this._reverseLastScrollY = Animated.multiply(
            new Animated.Value(-1),
            this._lastScrollY
        );

        this._translateYOffset = new Animated.Value(this.state.snap_points_from_top[this.state.snap_points_from_top.length - 1]);
        this._translateY = Animated.add(
            this._translateYOffset,
            Animated.add(this._dragY, this._reverseLastScrollY)
        ).interpolate({
            inputRange: [this.state.snap_points_from_top[0], this.state.snap_points_from_top[this.state.snap_points_from_top.length - 1]],
            outputRange: [this.state.snap_points_from_top[0], this.state.snap_points_from_top[this.state.snap_points_from_top.length - 1]],
            extrapolate: 'clamp',
        });
    }
    _onHeaderHandlerStateChange = ({ nativeEvent }) => {
        if (nativeEvent.oldState === State.BEGAN) {
            this._lastScrollY.setValue(0);
        }
        this._onHandlerStateChange({ nativeEvent });
    };
    _onHandlerStateChange = ({ nativeEvent }) => {
        if (nativeEvent.oldState === State.ACTIVE) {
            let { velocityY, translationY } = nativeEvent;
            translationY -= this._lastScrollYValue;
            const dragToss = 1;
            const endOffsetY =
                this.state.snap_points_from_top[this.state.snap_points_from_top.length - 1] + translationY + dragToss * velocityY;

            let destSnapPoint = this.state.snap_points_from_top[0];
            for (let i = 0; i < this.state.snap_points_from_top.length; i++) {
                const snapPoint = this.state.snap_points_from_top[i];
                const distFromSnap = Math.abs(snapPoint - endOffsetY);
                if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
                    destSnapPoint = snapPoint;
                }
            }
            this.setState({ lastSnap: destSnapPoint });
            this._translateYOffset.extractOffset();
            this._translateYOffset.setValue(translationY);
            this._translateYOffset.flattenOffset();
            this._dragY.setValue(0);
            Animated.spring(this._translateYOffset, {
                velocity: velocityY,
                tension: 68,
                friction: 12,
                toValue: destSnapPoint,
                useNativeDriver: true,
            }).start();
        }
    };
    render() {
        return (
            <View style={AppStyles.container}>
                {/* parent of slider view */}
                <View style={{ flex: 1, backgroundColor: 'skyblue' }}>
                    {this.props.children[0]}
                </View>

                {/* Slider Starts */}
                <TapGestureHandler
                    maxDurationMs={100000}
                    ref={this.masterdrawer}
                    maxDeltaY={this.state.snap_points_from_top[this.state.snap_points_from_top.length - 1] - this.state.snap_points_from_top[0]}>
                    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFillObject,
                                {
                                    transform: [{ translateY: this._translateY }]
                                },
                            ]}>

                            <PanGestureHandler
                                ref={this.drawer}
                                simultaneousHandlers={[this.scroll, this.masterdrawer]}
                                shouldCancelWhenOutside={false}
                                onGestureEvent={this._onGestureEvent}
                                onHandlerStateChange={this._onHandlerStateChange}>
                                <Animated.View style={styles.container}>
                                    <NativeViewGestureHandler
                                        ref={this.scroll}
                                        waitFor={this.masterdrawer}
                                        simultaneousHandlers={this.drawer}>
                                        <Animated.ScrollView
                                            style={[
                                                styles.scrollView,
                                                { marginBottom: this.state.snap_points_from_top[0] },
                                            ]}
                                            bounces={true}
                                            onScrollBeginDrag={this._onRegisterLastScroll}
                                            scrollEventThrottle={1}>

                                            {/* Container of Slider */}
                                            <View style={styles.slider}>
                                                <View style={{ width: 100, backgroundColor: '#e3e3e3', height: 5, borderRadius: 10, marginBottom: 50, alignSelf: 'center', marginTop: 10 }} />
                                                {this.props.children[1]}
                                            </View>
                                        </Animated.ScrollView>
                                    </NativeViewGestureHandler>
                                </Animated.View>
                            </PanGestureHandler>
                        </Animated.View>
                    </View>
                </TapGestureHandler>
            </View>
        );
    }
    componentDidMount() {

        // if (this.props.snap_points_from_top?.length > 0) {
        //     this.setState({ snap_points_from_top: this.props.snap_points_from_top })
        // }

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },




    scrollView: {
        width: '100%',
        height: '100%'
    },

    slider: {
        flex: 1,
        height: Dimensions.get('window').height,
        width: '100%',
        backgroundColor: 'lightpink',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },

});
