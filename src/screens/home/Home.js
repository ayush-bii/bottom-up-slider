import React from 'react';
import { View, Image } from 'react-native';
import { BottomSheet } from '../../components/commonComponents/BottonSheet';
import { styles } from './styles';
import AppConstants from '../../utils/AppConstants';


const Home = (props) => {

    const Parent = () => {
        return (<Image source={{ uri: 'https://images.unsplash.com/photo-1645781893238-5b592576d187?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDl8SnBnNktpZGwtSGt8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60' }} style={{ height: '100%', width: '100%' }} />)
    }


    const slider = () => {
        return (<Image source={{ uri: 'https://images.unsplash.com/photo-1500621137413-1a61d6ac1d44?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2N3x8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60' }} style={{ height: '100%', width: '100%' }} />)
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


