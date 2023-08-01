import { ChainId } from '@portkey/types';
import { ChainType } from '../../../types/dist/commonjs';
import { AchTxAddressReceivedType } from '@portkey/socket';

export enum RampTypeEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum RampDrawerType {
  TOKEN = 'TOKEN',
  CURRENCY = 'CURRENCY',
}

export interface IRampConfig {
  isBuySectionShow: boolean;
  isSellSectionShow: boolean;
  isManagerSynced: boolean;
}

export interface IAchConfig {
  appId: string;
  baseUrl: string;
  updateAchOrder: string;
}

export interface GetFiatType {
  currency: string; // 3 letters fiat code
  country: string; // 2 letters region code
  payWayCode: string; // code of payment
  payWayName: string; // name of payment
  fixedFee: number | string; // ramp flat rate
  rateFee?: number | string; // ramp percentage rate
  payMin: number | string;
  payMax: number | string;
}

export interface FiatType extends GetFiatType {
  countryName?: string;
  icon?: string;
}

export type PartialFiatType = Partial<FiatType>;

export interface AchTokenInfoType {
  token: string;
  expires: number;
}
export interface PaymentStateType {
  buyFiatList: FiatType[];
  sellFiatList: FiatType[];
  achTokenInfo?: AchTokenInfoType;
}

export interface ICurrencyItem {
  country: string;
  iso: string;
  icon: string;
}

export interface ICurToken {
  crypto: string;
  network: string;
}

export type ITokenType = {
  symbol: string;
  chainId: ChainId;
};

export type IRampInitState = {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
  amount?: string;
  side: RampTypeEnum;
  tokenInfo?: any;
};

export type IRampPreviewInitState = {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
  amount: string;
  side: RampTypeEnum;
};

export type ITokenInfo = {
  balance: number | string;
  decimals: number | string;
  chainId: ChainId;
  symbol: string;
  tokenContractAddress: string;
};

export interface PaymentSellTransferResult {
  publicKey: string;
  signature: string; // sign(md5(orderId + rawTransaction))
  rawTransaction: string;
}

export type SellTransferParams = Pick<AchTxAddressReceivedType, 'merchantName' | 'orderId'> & {
  // sellBaseURL: string; // request.defaultConfig.baseURL
  paymentSellTransfer: (params: AchTxAddressReceivedType) => Promise<PaymentSellTransferResult>;
};

export interface PaymentLimitType {
  min: number;
  max: number;
}

export interface ISellTransferParams {
  isMainnet: boolean;
}

export interface IUseHandleAchSellParams {
  isMainnet: boolean;
  chainInfo: {
    caContractAddress: string;
    endPoint: string;
  };
  tokenInfo: ITokenInfo;
}
