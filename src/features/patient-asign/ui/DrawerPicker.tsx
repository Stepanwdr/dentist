import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { ServicesList } from "./ServicesList";

export interface ServicePickerRef {
  open: () => void;
  close: () => void;
}

interface Props {
  services: string[];
  onSelect: (value: string) => void;
}
export const DrawerPicker = forwardRef<ServicePickerRef,Props >(
  ({ services, onSelect }, ref) => {
    const sheetRef = useRef<ActionSheetRef>(null);

    const open = () => sheetRef.current?.show();
    const close = () => sheetRef.current?.hide();

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    return (
      <ActionSheet ref={sheetRef} gestureEnabled>
       <ServicesList services={services} onSelect={onSelect} close={close} />
      </ActionSheet>
    );
  }
);