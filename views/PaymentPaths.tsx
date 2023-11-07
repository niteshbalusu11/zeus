import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import Header from '../components/Header';
import PaymentPath from '../components/PaymentPath';
import Screen from '../components/Screen';

import ChannelsStore from '../stores/ChannelsStore';

import { localeString } from '../utils/LocaleUtils';
import { themeColor } from '../utils/ThemeUtils';

interface PaymentPathsViewProps {
    navigation: any;
    ChannelsStore: ChannelsStore;
}

export default class PaymentPathsView extends React.Component<PaymentPathsViewProps> {
    render() {
        const { navigation } = this.props;
        const enhancedPath = navigation.getParam('enhancedPath', null);

        return (
            <Screen>
                <Header
                    leftComponent="Back"
                    centerComponent={{
                        text:
                            enhancedPath.length > 1
                                ? `${localeString('views.Payment.paths')} (${
                                      enhancedPath.length
                                  })`
                                : localeString('views.Payment.path'),
                        style: {
                            color: themeColor('text'),
                            fontFamily: 'PPNeueMontreal-Book'
                        }
                    }}
                    navigation={navigation}
                />
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={styles.content}>
                        {enhancedPath.length > 0 && (
                            <PaymentPath enhancedPath={enhancedPath} />
                        )}
                    </View>
                </ScrollView>
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingLeft: 20,
        paddingRight: 20
    }
});
