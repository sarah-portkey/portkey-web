import { ChainType } from '@portkey/types';
import { getChainIdByAddress, getChainNumber } from '../aelf';
import { BaseToken, the2ThFailedActivityItemType } from '../../components/types/assets';
import { getChain } from '../../hooks/useChainInfo';
import { getContractBasic } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
import { crossChainTransferToCa } from './crossChainTransferToCa';

interface CrossChainTransferParams {
  sandboxId?: string;
  chainType: ChainType;
  privateKey: string;
  managerAddress: string;
  tokenInfo: BaseToken;
  caHash: string;
  amount: number;
  toAddress: string;
  memo?: string;
  crossChainFee: number;
}

export type CrossChainTransferIntervalParams = Omit<CrossChainTransferParams, 'caHash' | 'crossChainFee'> & {
  tokenIssueChainId: number;
};

export const intervalCrossChainTransfer = async (params: CrossChainTransferIntervalParams, count = 0) => {
  const { chainType, privateKey, amount, tokenInfo, memo, toAddress, tokenIssueChainId } = params;
  const toChainId = getChainIdByAddress(toAddress, chainType);
  try {
    const crossChainResult = await crossChainTransferToCa({
      chainId: tokenInfo.chainId,
      chainType,
      privateKey,
      contractAddress: tokenInfo.address,
      paramsOption: {
        issueChainId: tokenIssueChainId,
        toChainId: getChainNumber(toChainId),
        symbol: tokenInfo.symbol,
        to: toAddress,
        amount,
        memo,
      },
    });

    if (crossChainResult.error) throw crossChainResult.error;
  } catch (error) {
    console.log('intervalCrossChainTransfer:', error);
    count++;
    if (count > 5) throw error;
    await intervalCrossChainTransfer(params, count);
  }
};

const crossChainTransfer = async ({
  sandboxId,
  chainType,
  privateKey,
  managerAddress,
  caHash,
  amount,
  tokenInfo,
  memo,
  toAddress,
}: CrossChainTransferParams) => {
  const chainId = tokenInfo.chainId;
  const chainInfo = await getChain(chainId);
  if (!chainInfo) throw 'Please check network connection and chainId';
  let managerTransferResult;
  const account = aelf.getWallet(privateKey);
  const tokenContract = await getContractBasic({
    rpcUrl: chainInfo.endPoint,
    account,
    contractAddress: tokenInfo.address,
    chainType,
  });
  try {
    const contract = await getContractBasic({
      rpcUrl: chainInfo.endPoint,
      account,
      contractAddress: chainInfo.caContractAddress,
      chainType,
    });
    managerTransferResult = await contract.callSendMethod('ManagerTransfer', account.address, {
      caHash,
      symbol: tokenInfo.symbol,
      to: managerAddress,
      amount,
      memo,
    });
    if (!managerTransferResult.transactionId) throw 'ManagerTransfer missing transactionId';
  } catch (error) {
    throw {
      type: 'managerTransfer',
      error: error,
    };
  }
  // second transaction:crossChain transfer to toAddress

  // return;
  // TODO Only support chainType: aelf

  const tokenInfoResult = await tokenContract.callViewMethod('GetTokenInfo', { symbol: tokenInfo.symbol });

  const tokenIssueChainId = tokenInfoResult.data.issueChainId;
  const crossChainTransferParams = {
    chainType,
    privateKey,
    managerAddress,
    amount,
    tokenInfo,
    memo,
    toAddress,
    chainId,
    tokenIssueChainId,
  };
  try {
    await intervalCrossChainTransfer(crossChainTransferParams);
  } catch (error) {
    const returnData: the2ThFailedActivityItemType = {
      transactionId: managerTransferResult.transactionId,
      params: {
        tokenInfo,
        chainType,
        managerAddress,
        amount,
        memo,
        toAddress,
        chainId,
        sandboxId,
        tokenIssueChainId,
      },
    };
    throw {
      type: 'crossChainTransfer',
      error: error,
      managerTransferTxId: managerTransferResult.transactionId,
      data: returnData,
    };
  }
};

export default crossChainTransfer;
