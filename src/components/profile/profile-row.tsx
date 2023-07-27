import React, { memo, useState } from 'react';
import { Alert } from 'react-native';
import { Colors, ExpandableSection, Image, ListItem, Stepper, Text } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { addToOrder, clearOrder, getOrderVendor, removeFromOrder, selectOrderItemsWithId } from '../../../src/slices/order-slice';

const ProfileRow = (props) => {
  const {item, vendor, customer} = props;
  const [isPressed, setIsPressed] = useState(false);
  let items = useSelector((state) => selectOrderItemsWithId(state, item.id));
  const orderVendor = useSelector(getOrderVendor);
  const dispatch = useDispatch();

  const clearOrderItems = (() => {
    dispatch(clearOrder());
  });

	const updateItemCount = ((value) => {
    if (orderVendor && vendor.id !== orderVendor.id) {
      Alert.alert("Clear Basket", "Your cart currently has items from another vendor, would you like us to clear it to fill items from this vendor?", [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: clearOrderItems},
      ]);

      return
    }

    if (value < items.length && items.length == 0) return;

		if (value > items.length) {
			dispatch(addToOrder({ product: item, vendor: vendor, customer: customer }));
		} else if (value < items.length) {
			dispatch(removeFromOrder(item));
		}

		return;
  });

  return (
    <ExpandableSection
      key={item.id}
      expanded={isPressed} 
      sectionHeader={<ListItem
        key={item.id}
        activeOpacity={0.3}
        backgroundColor={Colors.white}
        onPress={() => setIsPressed(!isPressed)}
        style={{ borderRadius: 8, marginBottom: 4, paddingHorizontal: 8, paddingVertical: 4, height: "auto" }}
      >
        <ListItem.Part middle column>
          <Text text65 marginV-4>{item.title}</Text>
          <Text text80M grey30 marginV-4>${item.price.toFixed(2)}</Text>
        </ListItem.Part>
        {item.images[0] && <ListItem.Part right>
          <Image source={{ uri: item.images[0] }} style={{ width: 50, height: 50 }} />
        </ListItem.Part>}
      </ListItem>} 
    >
      <ListItem
        key={item.id}
        activeBackgroundColor={Colors.grey60}
        activeOpacity={0.3}
        backgroundColor={Colors.white}
        onPress={() => setIsPressed(!isPressed)}
        style={{ borderRadius: 8, paddingHorizontal: 8, height: "auto", marginBottom: 8 }}
      >
        <ListItem.Part middle column>
          <Stepper value={items.length} onValueChange={(value) => updateItemCount(value)} useCustomTheme={true} minValue={0} maxValue={item.quantity} />
        </ListItem.Part>
      </ListItem>
    </ExpandableSection>
  );
};

export default memo(ProfileRow);