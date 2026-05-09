export type UsbEndpoint = {
  direction: string;
  endpointNumber: number;
};

export type UsbAlternate = {
  endpoints: UsbEndpoint[];
};

export type UsbInterface = {
  alternates: UsbAlternate[];
  interfaceNumber: number;
};

export type UsbDevice = {
  open: () => Promise<void>;
  selectConfiguration: (configurationValue: number) => Promise<void>;
  claimInterface: (interfaceNumber: number) => Promise<void>;
  transferOut: (endpointNumber: number, data: Uint8Array) => Promise<unknown>;
  configuration: {
    interfaces: UsbInterface[];
  };
};

export type UsbNavigator = {
  getDevices: () => Promise<UsbDevice[]>;
  requestDevice: (options: { filters: unknown[] }) => Promise<UsbDevice>;
};

declare global {
  interface Navigator {
    usb: UsbNavigator;
  }
}
