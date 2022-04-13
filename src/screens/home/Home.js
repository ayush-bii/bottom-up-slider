import React from 'react';
import { View, Dimensions } from 'react-native';
import { BottomSheet } from '../../components/commonComponents/BottonSheet';
import { styles } from './styles';
import AppConstants from '../../utils/AppConstants';


const Home = (props) => {

    const Parent = () => {
        return (<View style={{ height: '100%', width: '100%', backgroundColor: 'white' }} />)
    }


    const slider = () => {
        return (<View style={{ height: '100%', width: '100%', }} />)
    }


    return (
        <View style={styles.container}>
            <BottomSheet
                snap_points_from_top={[0, 100, Dimensions.get('window').height - Dimensions.get('window').height / 4]}
            >
                <Parent />

                {slider()}

            </BottomSheet>
        </View>
    )
}

export default Home;


