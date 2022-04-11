import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomSheet } from '../../components/commonComponents/BottonSheet';
import { styles } from './styles';
import AppConstants from '../../utils/AppConstants';


const Home = (props) => {

    const Parent = () => {
        return (<TouchableOpacity onPress={() => alert('hello')} style={{ backgroundColor: 'red', height: 100, width: 100 }} />)
    }


    const slider = () => {
        return (<View style={{ backgroundColor: 'green', height: 100, width: 100 }} />)
    }


    return (
        <View style={styles.container}>
            <BottomSheet
                snap_points_from_top={[0, 500, 180]}
            >
                <Parent />

                {slider()}

            </BottomSheet>
        </View>
    )
}

export default Home;


