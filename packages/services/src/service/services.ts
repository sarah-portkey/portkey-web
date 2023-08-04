import { IBaseRequest } from '@portkey/types';
import { IServices } from '../types/services';
import { ICommunityRecoveryService, IRampService, IAssetsService, ITokenService } from '../types';
import { IDIDGraphQL } from '@portkey/graphql';
import { CommunityRecovery } from './communityRecovery';
import { Ramp } from './ramp';
import { Assets } from './assets';
import { Token } from './token';

export class Services<T extends IBaseRequest = IBaseRequest> extends CommunityRecovery<T> implements IServices {
  readonly communityRecovery: ICommunityRecoveryService;
  readonly ramp: IRampService;
  readonly assets: IAssetsService;
  readonly token: ITokenService;
  constructor(request: T, didGraphQL: IDIDGraphQL) {
    super(request, didGraphQL);
    this.communityRecovery = new CommunityRecovery(request, didGraphQL);
    this.ramp = new Ramp(request);
    this.assets = new Assets(request);
    this.token = new Token(request);
  }
}
