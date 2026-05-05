import React, { forwardRef, useImperativeHandle, useRef } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
export interface DrawerRef {
  open: () => void;
  close: () => void;
}

interface DrawerProps {
  children: React.ReactNode;
  onClose?: () => void;
  enableGesturesInScrollView?: boolean;
  gestureEnabled?: boolean;
}
const { height } = Dimensions.get('window');
export const Drawer = forwardRef<DrawerRef, DrawerProps>(
  ({ children, onClose,enableGesturesInScrollView=true,gestureEnabled }, ref) => {
    const sheetRef = useRef<ActionSheetRef>(null);
    const open = () => sheetRef.current?.show();
    const close = () => sheetRef.current?.hide();

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    return (
      <ActionSheet
        ref={sheetRef}
        onClose={onClose}
        enableGesturesInScrollView={enableGesturesInScrollView}
        closeOnTouchBackdrop={true}
        gestureEnabled={gestureEnabled}
        containerStyle={[
          styles.drawer,
          {
            height:height - 80,
          },
        ]}
      >
        {!gestureEnabled && <View style={styles.handle}/>}
        {!gestureEnabled && <TouchableOpacity style={styles.close} onPress={close}><Ionicons name={'close'}/></TouchableOpacity>}
        {children}
      </ActionSheet>
    );
  }
);

const styles = StyleSheet.create({
  drawer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 10,
  },
  close: {
    width: 25,
    height: 25,
    borderRadius: '50%',
    backgroundColor: "#ccc",
    alignSelf: "flex-end",
    marginBottom: 10,
    textAlign:"center",
    alignItems:"center",
    justifyContent:'center',
    right:0
  },
});