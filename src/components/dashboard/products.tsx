import React, { Fragment } from 'react';
import { Colors, ListItem, Text, View } from 'react-native-ui-lib';
import ProductRow from './product-row';

const Products = (props) => {
	const { cpp } = props;

	return (
		<Fragment>
			<ListItem
				activeOpacity={0.3}
				backgroundColor={Colors.grey60}
				height={60}
			>
				<ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
					<Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
						Cashflow per Product
					</Text>
				</ListItem.Part>
			</ListItem>

			{cpp.length == 0 
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
						{cpp.map((item) => (
							<ProductRow item={item} />
						))}
					</View>
			}
		</Fragment>

	)
}

export default Products