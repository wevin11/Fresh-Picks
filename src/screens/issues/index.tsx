import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, LoaderScreen, Text, View } from 'react-native-ui-lib';
import { db } from '../../../firebase';
import IssueRow from '../../../src/components/issues/issue-row';
import { global } from '../../../style';

const Issues = () => {
	const [issues, setIssues] = useState<any>(null);
  const [loading, setLoading] = useState(true);

	const renderItem = useCallback(({item}: any) => {
    return <IssueRow item={item} />;
  }, []);

	useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Issues")), async (snapshot) => {
      setIssues(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

	useEffect(() => {
    if (issues) {
      setLoading(false);
    }
  }, [issues]);

	if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  if (issues.length == 0) {
    return (
      <View useSafeArea flex backgroundColor={Colors.white} style={[global.center, global.container]}>
        <Text text65 marginV-4>No issues made yet</Text>
      </View>
    )
  }

	return (
		<View useSafeArea flex backgroundColor={Colors.white}>
      <FlashList 
        data={issues}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={issues.length != 0 ? issues.length : 150}
        renderItem={renderItem}
      />
    </View>
	)
}

export default Issues