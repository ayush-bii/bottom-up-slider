import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    separator: {
        height: 10,
    },
    searchView: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ddd',
        borderBottomWidth: 0.8
    },

    searchIcon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        marginHorizontal: 20
    },

    searchInput: {
        flex: 1,
        paddingVertical: 0
    },

    flatlist: {
        flexGrow: 1,
        padding: 20
    },
});

