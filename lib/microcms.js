import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: 'ashroom-schedule', // microCMSのURLの「XXX.microcms.io」のXXXの部分
  apiKey: 'SEeKttu54YYKQ3O2SWO7rh84mCiqibiOQmk7', // 設定 > APIキー にある文字列
});
