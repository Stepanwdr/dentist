
import { createNavigationContainerRef } from "@react-navigation/native";
import { TabParamList} from "./types";

export const navigationRef =
  createNavigationContainerRef<TabParamList>();

// 👇 магия типов
type NavigateArgs<T extends keyof TabParamList> =
  undefined extends TabParamList[T]
    ? [screen: T] | [screen: T, params: TabParamList[T]]
    : [screen: T, params: TabParamList[T]];

export function navigate<T extends keyof TabParamList>(
  ...args: NavigateArgs<T>
) {
  if (!navigationRef.isReady()) return;

  navigationRef.navigate(...(args as any));
}