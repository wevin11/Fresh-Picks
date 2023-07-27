import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, LoaderScreen, Text, View } from 'react-native-ui-lib';
import { db } from '../../../firebase';
import IssueRow from '../../../src/components/issues/issue-row';
import { global } from '../../../style';

const Reports = () => {
	const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);

	const renderItem = useCallback(({item}: any) => {
    return <IssueRow item={item} />;
  }, []);

	useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Reports")), async (snapshot) => {
      setReports(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

	useEffect(() => {
    if (reports) {
      setLoading(false);
    }
  }, [reports]);

	if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  if (reports.length == 0) {
    return (
      <View useSafeArea flex backgroundColor={Colors.white} style={[global.center, global.container]}>
        <Text text65 marginV-4>No reports made yet</Text>
      </View>
    )
  }

	return (
		<View useSafeArea flex backgroundColor={Colors.white}>
      <FlashList 
        data={reports}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={reports.length != 0 ? reports.length : 150}
        renderItem={renderItem}
      />
    </View>
	)
}

export default Reports