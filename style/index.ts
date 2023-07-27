import { StyleSheet } from "react-native";
import { Colors } from "react-native-ui-lib";

export const global = StyleSheet.create({
  container: {
    padding: 16
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  fullscreen: {
    width: "100%",
    height: "100%"
  },
  flex: {
    flex: 1
  },
  flexGrow: {
    flexGrow: 1
  },
  flexWrap: {
    flexWrap: "wrap"
  },
  spaceBetween: {
    justifyContent: "space-between"
  },
  spaceEvenly: {
    justifyContent: "space-evenly"
  },
  white: {
    backgroundColor: Colors.white
  },
  gray: {
    backgroundColor: Colors.grey60
  },
  button: {
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
  },
  checkbox: {
    backgroundColor: Colors.white,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 150
  },
  field: {
    paddingVertical: 8,
    width: "100%"
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 8,
  },
  time: {
    backgroundColor: Colors.white,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 8,
  },
  otp: {
    backgroundColor: Colors.white,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.black,
    height: 50,
    paddingHorizontal: 8,
    width: 50
  },
  area: {
    backgroundColor: Colors.white,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 50,
    paddingHorizontal: 8,
  },
  underline: {
    borderColor: "#03DAC6",
  },
  // item: {
  //   marginVertical: 16,
  //   paddingHorizontal: 16,
  //   backgroundColor: 'white',
  //   borderBottomWidth: 1,
  //   borderBottomColor: 'lightgrey',
  //   flexDirection: 'row',
  //   alignItems: "center",
  // },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 8,
    justifyContent: "center",
    padding: 12,
    marginRight: 16,
    marginVertical: 12,
    height: 90
  },
  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14
  },
  reserve: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});