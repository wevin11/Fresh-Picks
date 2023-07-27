import React, { Fragment, useState } from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const Cashflow = (props) => {
	const { sum, start, end } = props;
	const [showCalendar, setShowCalendar] = useState(false);
	const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const openDatePickerRange = () => setShowCalendar(true)

  const onCancelRange = () => {
    setShowCalendar(false)
  }

  const onConfirmRange = (output) => {
    setShowCalendar(false)
    setStartDate(output.startDate)
    setEndDate(output.endDate)
  }

	return (
		<Fragment>
			<ListItem
				activeOpacity={0.3}
				backgroundColor={Colors.grey60}
				height={60}
			>
				<ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
					<Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
						Your Cashflow
					</Text>
				</ListItem.Part>
			</ListItem>

			<ListItem
				activeOpacity={0.3}
				backgroundColor={Colors.white}
				style={{ padding: 8, height: "auto" }}
			>
				<ListItem.Part column>
					<Text text65 marginV-4 numberOfLines={1}>{start.toLocaleDateString()} - {end.toLocaleDateString()}</Text>
					<Text text80M grey30 marginV-4>{sum.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</Text>
				</ListItem.Part>
			</ListItem>

			{/* <DatePicker
				isVisible={showCalendar}
				mode={'range'}
				onCancel={onCancelRange}
				onConfirm={onConfirmRange}
			/> */}
		</Fragment>
	)
}

export default Cashflow