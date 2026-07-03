import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Platform } from "react-native";
import { OverlayAlert } from "../components/overlay/alert";
import { OverlayConfirm } from "../components/overlay/confirm";
import { OverlayToast, ToastVariant } from "../components/overlay/toast";
import { OverlayModal } from "../components/overlay/modal";
import { OverlaySheet } from "../components/overlay/sheet";
import { OverlayLoader } from "../components/overlay/loader";

type AlertOptions = {
  title: string;
  message: string;
  buttonText?: string;
  onPress?: () => void;
};

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
};

type ToastOptions = {
  message: string;
  duration?: number;
  variant?: ToastVariant;
  icon?: string;
};

type ModalOptions = {
  content: React.ReactNode;
  onDismiss?: () => void;
  dismissable?: boolean;
};

type SheetOptions = {
  title?: string;
  content: React.ReactNode;
  onDismiss?: () => void;
};

type OverlayContextType = {
  // Alert
  alert: (options: AlertOptions) => void;
  // Confirm
  confirm: (options: ConfirmOptions) => void;
  // Toast
  toast: (options: ToastOptions | string) => void;
  // Modal
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
  modalVisible: boolean;
  // Sheet
  showSheet: (options: SheetOptions) => void;
  hideSheet: () => void;
  sheetVisible: boolean;
  // Loader
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
  isOverlayActive: boolean;
  performRefresh: (
    task: () => Promise<void>,
    message?: string,
  ) => Promise<void>;
  // Internal render state — consumed by <OverlayOutlet />, not by screens.
  _alertVisible: boolean;
  _alertConfig: AlertOptions | null;
  _confirmVisible: boolean;
  _confirmConfig: ConfirmOptions | null;
  _toastVisible: boolean;
  _toastConfig: ToastOptions | null;
  _modalConfig: ModalOptions | null;
  _sheetConfig: SheetOptions | null;
  _loaderMessage: string | undefined;
  _dismissToast: () => void;
  _handleAlertClose: () => void;
  _handleConfirmAction: () => void;
  _handleConfirmCancel: () => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  // Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);

  // Confirm State
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmOptions | null>(
    null,
  );

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastConfig, setToastConfig] = useState<ToastOptions | null>(null);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalOptions | null>(null);

  // Sheet State
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetConfig, setSheetConfig] = useState<SheetOptions | null>(null);

  // Loader State
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState<string | undefined>(
    undefined,
  );

  const isOverlayActive =
    alertVisible ||
    confirmVisible ||
    modalVisible ||
    sheetVisible ||
    isLoading;

  useEffect(() => {
    if (Platform.OS === "web") {
      // Prevent background scrolling when overlay is active
      document.body.style.overflow = isOverlayActive ? "hidden" : "auto";
    }
  }, [isOverlayActive]);

  const alert = useCallback((options: AlertOptions) => {
    setAlertConfig(options);
    setAlertVisible(true);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmConfig(options);
    setConfirmVisible(true);
  }, []);

  const toast = useCallback((options: ToastOptions | string) => {
    if (typeof options === "string") {
      setToastConfig({ message: options });
    } else {
      setToastConfig(options);
    }
    setToastVisible(true);
  }, []);

  const showModal = useCallback((options: ModalOptions) => {
    setModalConfig(options);
    setModalVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setModalVisible(false);
    modalConfig?.onDismiss?.();
  }, [modalConfig]);

  const showSheet = useCallback((options: SheetOptions) => {
    setSheetConfig(options);
    setSheetVisible(true);
  }, []);

  const hideSheet = useCallback(() => {
    setSheetVisible(false);
    sheetConfig?.onDismiss?.();
  }, [sheetConfig]);

  const showLoader = useCallback((msg?: string) => {
    setLoaderMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const performRefresh = useCallback(
    async (task: () => Promise<void>, msg: string = "Refreshing...") => {
      setIsRefreshing(true);
      showLoader(msg);
      const refreshTimeout = setTimeout(() => setIsRefreshing(false), 0);

      try {
        await task();
      } finally {
        clearTimeout(refreshTimeout);
        hideLoader();
        setIsRefreshing(false);
      }
    },
    [showLoader, hideLoader],
  );

  const handleAlertClose = () => {
    setAlertVisible(false);
    alertConfig?.onPress?.();
  };

  const handleConfirmAction = () => {
    setConfirmVisible(false);
    confirmConfig?.onConfirm();
  };

  const handleConfirmCancel = () => {
    setConfirmVisible(false);
    confirmConfig?.onCancel?.();
  };

  const dismissToast = useCallback(() => setToastVisible(false), []);

  return (
    <OverlayContext.Provider
      value={{
        alert,
        confirm,
        toast,
        showModal,
        hideModal,
        modalVisible,
        showSheet,
        hideSheet,
        sheetVisible,
        showLoader,
        hideLoader,
        isLoading,
        isRefreshing,
        isOverlayActive,
        performRefresh,
        _alertVisible: alertVisible,
        _alertConfig: alertConfig,
        _confirmVisible: confirmVisible,
        _confirmConfig: confirmConfig,
        _toastVisible: toastVisible,
        _toastConfig: toastConfig,
        _modalConfig: modalConfig,
        _sheetConfig: sheetConfig,
        _loaderMessage: loaderMessage,
        _dismissToast: dismissToast,
        _handleAlertClose: handleAlertClose,
        _handleConfirmAction: handleConfirmAction,
        _handleConfirmCancel: handleConfirmCancel,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
}

const dummyOverlayContext: OverlayContextType = {
  alert: () => {},
  confirm: () => {},
  toast: () => {},
  showModal: () => {},
  hideModal: () => {},
  modalVisible: false,
  showSheet: () => {},
  hideSheet: () => {},
  sheetVisible: false,
  showLoader: () => {},
  hideLoader: () => {},
  isLoading: false,
  isRefreshing: false,
  isOverlayActive: false,
  performRefresh: async (task: () => Promise<void>) => {
    await task();
  },
  _alertVisible: false,
  _alertConfig: null,
  _confirmVisible: false,
  _confirmConfig: null,
  _toastVisible: false,
  _toastConfig: null,
  _modalConfig: null,
  _sheetConfig: null,
  _loaderMessage: undefined,
  _dismissToast: () => {},
  _handleAlertClose: () => {},
  _handleConfirmAction: () => {},
  _handleConfirmCancel: () => {},
};

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  // Dummy fallback prevents crashes if used outside the provider.
  return context ?? dummyOverlayContext;
};

// Renders the actual overlay UI. Kept separate from OverlayProvider so it can
// be mounted at a specific point in the tree (e.g. inside the desktop device
// frame in app/_layout.tsx) instead of always escaping to the outermost
// Portal.Host — otherwise toast/modal/sheet/loader render relative to the
// full browser viewport instead of staying inside the frame.
export function OverlayOutlet() {
  const {
    _alertVisible,
    _alertConfig,
    _confirmVisible,
    _confirmConfig,
    _toastVisible,
    _toastConfig,
    _modalConfig,
    _sheetConfig,
    _loaderMessage,
    isLoading,
    modalVisible,
    sheetVisible,
    hideModal,
    hideSheet,
    _dismissToast,
    _handleAlertClose,
    _handleConfirmAction,
    _handleConfirmCancel,
  } = useOverlay();

  return (
    <>
      <OverlayAlert
        visible={_alertVisible}
        title={_alertConfig?.title}
        message={_alertConfig?.message}
        buttonText={_alertConfig?.buttonText}
        onClose={_handleAlertClose}
      />

      <OverlayConfirm
        visible={_confirmVisible}
        title={_confirmConfig?.title}
        message={_confirmConfig?.message}
        confirmText={_confirmConfig?.confirmText}
        cancelText={_confirmConfig?.cancelText}
        onConfirm={_handleConfirmAction}
        onCancel={_handleConfirmCancel}
        isDestructive={_confirmConfig?.isDestructive}
      />

      <OverlayModal
        visible={modalVisible}
        content={_modalConfig?.content}
        onDismiss={hideModal}
        dismissable={_modalConfig?.dismissable}
      />

      <OverlaySheet
        visible={sheetVisible}
        title={_sheetConfig?.title}
        content={_sheetConfig?.content}
        onDismiss={hideSheet}
      />

      <OverlayToast
        visible={_toastVisible}
        message={_toastConfig?.message || ""}
        onDismiss={_dismissToast}
        duration={_toastConfig?.duration}
        variant={_toastConfig?.variant}
        icon={_toastConfig?.icon}
      />

      <OverlayLoader visible={isLoading} message={_loaderMessage} />
    </>
  );
}
