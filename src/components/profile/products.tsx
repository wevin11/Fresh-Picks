import React from 'react';
import { Colors, ListItem, Text, View } from 'react-native-ui-lib';
import ProfileRow from './profile-row';

const Products = (props) => {
	const { products, vendor, customer } = props;

	return (
		<View>
			<ListItem
				activeOpacity={0.3}
				backgroundColor={Colors.grey60}
				height={60}
			>
				<ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
					<Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
						Products
					</Text>
				</ListItem.Part>
			</ListItem>

			{products.length == 0 
				? <ListItem
						activeOpacity={0.3}
						height={60}
					>
						<ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
							<Text text80M grey30 marginV-4>
								No products made yet
							</Text>
						</ListItem.Part>
					</ListItem>
				: <View>
						{products.map((item) => (
							<ProfileRow item={item} vendor={vendor} customer={customer} />
						))}
					</View>
			}
		</View>

	)
}

export default Products