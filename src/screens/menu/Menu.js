import React from 'react';
import { View, FlatList, Image, TextInput } from 'react-native';
import { styles } from './styles';
import AppImages from '../../utils/AppImages';
import AppStyles from '../../utils/AppStyles';
import SwipeableRow from '../../components/commonComponents/SwipeableRow';


const Menu = (props) => {
    return (
        <View style={AppStyles.container}>

            <View style={styles.searchView}>
                <Image
                    style={styles.searchIcon}
                    source={AppImages.search}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder='Search Menu'
                />
            </View>

            <View style={AppStyles.container}>
                <FlatList
                    contentContainerStyle={styles.flatlist}
                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    keyExtractor={(item, index) => `message ${index}`}
                    renderItem={({ item, index }) => (
                        <SwipeableRow />
                    )}
                />
            </View>

        </View>
    )
}

export default Menu;