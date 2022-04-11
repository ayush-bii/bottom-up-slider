import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import {
    PanGestureHandler,
    NativeViewGestureHandler,
    State,
    TapGestureHandler,
    TouchableOpacity,
} from 'react-native-gesture-handler';
import AppImages from '../../utils/AppImages';
import AppStyles from '../../utils/AppStyles';
import AppColors from '../../utils/AppColors';


const HEADER_HEIGHT = 100;
const SNAP_POINTS_FROM_TOP = [0, 100, Dimensions.get('window').height - 30];


export class BottomSheet extends Component {
    masterdrawer = React.createRef();
    drawer = React.createRef();
    drawerheader = React.createRef();
    scroll = React.createRef();
    constructor(props) {
        super(props);


        const START = SNAP_POINTS_FROM_TOP[0];
        const END = SNAP_POINTS_FROM_TOP[SNAP_POINTS_FROM_TOP.length - 1];

        this.state = {
            snap_points_from_top: [0, 100, Dimensions.get('window').height - 30],
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

            let destSnapPoint = SNAP_POINTS_FROM_TOP[0];
            for (let i = 0; i < SNAP_POINTS_FROM_TOP.length; i++) {
                const snapPoint = SNAP_POINTS_FROM_TOP[i];
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
        console.log(this.props.snap_points_from_top, '------------------  ', this.state.snap_points_from_top);

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
                    maxDeltaY={this.state.snap_points_from_top[this.state.snap_points_from_top.length - 1] - SNAP_POINTS_FROM_TOP[0]}>
                    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFillObject,
                                {
                                    transform: [{ translateY: this._translateY }]
                                },
                            ]}>
                            {/* <PanGestureHandler
                                ref={this.drawerheader}
                                simultaneousHandlers={[this.scroll, this.masterdrawer]}
                                shouldCancelWhenOutside={false}
                                onGestureEvent={this._onGestureEvent}
                                onHandlerStateChange={this._onHeaderHandlerStateChange}>



                                <Animated.View style={styles.header} >

                                    <View style={styles.circle} >

                                    </View>
                                    <View style={styles.headerWhite} />

                                </Animated.View>
                            </PanGestureHandler> */}
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
                                                { marginBottom: SNAP_POINTS_FROM_TOP[0] },
                                            ]}
                                            bounces={true}
                                            onScrollBeginDrag={this._onRegisterLastScroll}
                                            scrollEventThrottle={1}>

                                            {/* Container of Slider */}
                                            <View style={styles.slider}>
                                                <View style={{ width: 100, backgroundColor: '#e3e3e3', height: 5, borderRadius: 10, marginBottom: 50 }} />
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
        if (this.props.snap_points_from_top.length > 0) {

            this.setState({ snap_points_from_top: this.props.snap_points_from_top })
        }

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: HEADER_HEIGHT,
        alignItems: 'center'
    },
    circle: {
        height: 100,
        width: 100,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue'
    },

    headerWhite: {
        height: 50,
        zIndex: -1,
        width: '100%',
        marginTop: -50,
        backgroundColor: 'yellow',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },

    scrollView: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%'
    },

    slider: {
        flex: 1,
        height: Dimensions.get('window').height,
        alignItems: 'center',
        padding: 10,
        width: '100%',
        backgroundColor: 'black'
    },

});
