import React, { Fragment } from 'react';
import { Colors, ListItem, Text, View } from 'react-native-ui-lib';
import ProductRow from './product-row';

const Subscriptions = (props) => {
	const { cps } = props;

	return (
		<Fragment>
			<ListItem
				activeOpacity={0.3}
				backgroundColor={Colors.grey60}
				height={60}
			>
				<ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
					<Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
						Cashflow per Subscription
					</Text>
				</ListItem.Part>
			</ListItem>

			{cps.length == 0 
				? <ListItem
						activeOpacity={0.3}
						height={60}
					>
						<ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
							<Text text80M grey30 marginV-4>
								No subscriptions made yet
							</Text>
						</ListItem.Part>
					</ListItem>
				: <View>
						{cps.map((item) => (
							<ProductRow item={item} />
						))}
					</View>
			}
		</Fragment>
	)
}

export default Subscriptions