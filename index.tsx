import React, { FC, RefObject } from "react";
import { View, ViewProps, GestureResponderEvent } from "react-native";

interface OutsideViewProps extends ViewProps {
  /**
   * Ref of element you want to detect press event outside of
   */
  childRef: RefObject<any>;

  /**
   * callback function when press outside of ref component
   */
  onPressOutside?: () => void;
}

/**
 * use recursive to check if press inside that component
 * @param target - this is childRef component
 * @param nestedViewRef - all of children element of childRef
 */
const isTapInsideComponent = (target: any, nestedViewRef: any): boolean => {
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

  return false;
};

/**
 * Wrapper component to detect event outside a specific element
 * Inherit from View, so it will take all View's props
 * @param OutsideViewProps - acceptance props
 */
const OutsideView: FC<OutsideViewProps> = ({
  childRef,
  onPressOutside,
  onStartShouldSetResponder,
  ...rest
}) => (
  <View
    {...rest}
    onStartShouldSetResponder={(evt: GestureResponderEvent) => {
      evt.persist();

      // if press outside, execute onPressOutside callback
      if (
        onPressOutside &&
        childRef &&
        !isTapInsideComponent(evt.target, childRef.current || childRef)
      ) {
        onPressOutside();
      }

      // return onStartShouldSetResponder in case it is passed to OutsideView
      return onStartShouldSetResponder?.(evt) ?? true;
    }}
  />
);

export default OutsideView;
