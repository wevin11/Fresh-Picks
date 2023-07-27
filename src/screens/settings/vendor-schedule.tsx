import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Button, Colors, DateTimePicker, KeyboardAwareScrollView, Switch, Text, View } from 'react-native-ui-lib';
import { global } from '../../../style';

const VendorSchedule = () => {
  const [monday, setMonday] = useState<any>({ enable: false, start: null, end: null });
  const [tuesday, setTuesday] = useState<any>({ enable: false, start: null, end: null });
  const [wednesday, setWednesday] = useState<any>({ enable: false, start: null, end: null });
  const [thursday, setThursday] = useState<any>({ enable: false, start: null, end: null });
  const [friday, setFriday] = useState<any>({ enable: false, start: null, end: null });
  const [saturday, setSaturday] = useState<any>({ enable: false, start: null, end: null });
  const [sunday, setSunday] = useState<any>({ enable: false, start: null, end: null });

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <KeyboardAwareScrollView contentContainerStyle={[global.container, global.flexGrow]} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <View style={global.field}>
          <View row spread>
            <Text text65 marginV-4>Monday</Text>
            <Switch value={monday.enable} onValueChange={() => setMonday({...monday, enable: !monday.enable})} />
          </View>

          {monday.enable && <View row spread>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField />
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View row spread>
            <Text text65 marginV-4>Tuesday</Text>
            <Switch value={tuesday.enable} onValueChange={() => setTuesday({...tuesday, enable: !tuesday.enable})} />
          </View>

          {tuesday.enable && <View row spread>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField />
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View row spread>
            <Text text65 marginV-4>Wednesday</Text>
            <Switch value={wednesday.enable} onValueChange={() => setWednesday({...wednesday, enable: !wednesday.enable})} />
          </View>

          {wednesday.enable && <View row spread>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField />
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View row spread>
            <Text text65 marginV-4>Thursday</Text>
            <Switch value={thursday.enable} onValueChange={() => setThursday({...thursday, enable: !thursday.enable})} />
          </View>

          {thursday.enable && <View row spread>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View row spread>
            <Text text65 marginV-4>Friday</Text>
            <Switch value={friday.enable} onValueChange={() => setFriday({...friday, enable: !friday.enable})} />
          </View>

          {friday.enable && <View row spread>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View row spread>
            <Text text65 marginV-4>Saturday</Text>
            <Switch value={saturday.enable} onValueChange={() => setSaturday({...saturday, enable: !saturday.enable})} />
          </View>

          {saturday.enable && <View row spread>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View row spread>
            <Text text65 marginV-4>Sunday</Text>
            <Switch value={sunday.enable} onValueChange={() => setSunday({...sunday, enable: !sunday.enable})} />
          </View>

          {sunday.enable && <View row spread>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>

        <View flexG />

        <Button 
          backgroundColor={Colors.primary}
          color={Colors.white}
          label={"Update Vendor Schedule"} 
          labelStyle={{ fontWeight: '600', padding: 8 }} 
          style={global.button} 
          // onPress={handleSubmit}                
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

export default VendorSchedule