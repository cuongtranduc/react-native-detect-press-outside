import React from "react";
import { View } from "react-native";

// use recursive to check if press inside that component
const isTapInsideComponent = (target, nestedViewRef) => {
  if (
    target &&
    nestedViewRef &&
    target._nativeTag === nestedViewRef._nativeTag
  ) {
    return true;
  }

  if (nestedViewRef._children && nestedViewRef._children.length > 0) {
    for (let index = 0; index <= nestedViewRef._children.length - 1; index++) {
      if (isTapInsideComponent(target, nestedViewRef._children[index])) {
        return true;
      }
    }
  }
};

const OutsideView = ({ children, onPressOutside, childRef, ...rest }) => (
  <View
    {...rest}
    onStartShouldSetResponder={(evt) => {
      evt.persist();
      if (!childRef) {
        return;
      }
      if (!isTapInsideComponent(evt.target, childRef.current || childRef)) {
        onPressOutside && onPressOutside();
      }
    }}
  >
    {children}
  </View>
);

export default OutsideView;
