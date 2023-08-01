import { ChainType } from '@portkey/types';
import { SandboxEventService, SandboxEventTypes, SandboxErrorCode } from '../utils';

interface GetTransitionFeeParams {
  rpcUrl: string;
  contractAddress: string;
  chainType: ChainType;
  paramsOption: any;
  methodName: string;
  privateKey: string;
}

const getTransactionRaw = async ({
  rpcUrl,
  contractAddress,
  paramsOption,
  chainType,
  methodName,
  privateKey,
}: GetTransitionFeeParams) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.getTransactionRaw, {
    rpcUrl,
    address: contractAddress,
    paramsOption,
    chainType,
    methodName,
    privateKey,
  });

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.error;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      ...resMessage.message,
    },
  };
};

export default getTransactionRaw;
