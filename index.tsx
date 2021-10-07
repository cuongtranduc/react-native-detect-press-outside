// @flow

import React from "react";
import { View, ViewProps, GestureResponderEvent } from "react-native";

type OutsideViewProps = ViewProps & {
  /**
   * Either children or a render prop that receives a boolean reflecting whether
   * the component is currently pressed.
   */
  children?: React.ReactNode;

  /**
   * Ref of element you want to detect press event outside of
   */
  childRef: any;

  /**
   * callback funtion when press outside of ref component
   */
  onPressOutside: () => void;
};

/**
 * use recursive to check if press inside that component
 * @param target - this is childRef component
 * @param nestedViewRef - all of children element of childRef
 */
const isTapInsideComponent = (target: any, nestedViewRef: any) => {
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

/**
 * Wrapper component to detect event outside a specific element
 * Inherit from View, so it will take all View's props 
 * @param OutsideViewProps - acceptance props
 */
const OutsideView = ({
  children,
  onPressOutside,
  childRef,
  ...rest
}: OutsideViewProps) => (
  <View
    {...rest}
    onStartShouldSetResponder={(evt: GestureResponderEvent) => {
      evt.persist();
      if (!childRef) {
        return true;
      }
      if (!isTapInsideComponent(evt.target, childRef.current || childRef)) {
        onPressOutside && onPressOutside();
      }
      return true;
    }}
  >
    {rest}
  </View>
);

export default OutsideView;
