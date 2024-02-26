import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as OSS from 'ali-oss';
import { OSSType } from './dto/oss.type';
@Injectable()
export class OSSService {
  /**
   * @description 获取 OSS 上传签名
   * @see https://help.aliyun.com/document_detail/31926.html
   * @return {*}  {Promise<OSSType>}
   * @memberof OSSService
   */
  async getSignature(): Promise<OSSType> {
    const config = {
      accessKeyId: process.env.ACCESS_KEY || 'LTAI5tQQubMkQwBrxrsHk1MA',
      accessKeySecret: process.env.ACCESS_KEY_SECRET || 'zR2v7ina1cd0t1953T3FpzB8JAoMTo',
      bucket: 'panda-001',
      dir: 'images/',
    };

    const client = new OSS(config);

    const date = new Date();
    date.setDate(date.getDate() + 1);
    const policy = {
      expiration: date.toISOString(), // 请求有效期
      conditions: [
        ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制
      ],
    };

    // bucket域名
    const host = `https://${config.bucket}.${
      (await client.getBucketLocation()).location
    }.aliyuncs.com`.toString();
    //签名
    const formData = await client.calculatePostSignature(policy);
    console.log(formData,'oss上传')
    //返回参数
    const params = {
      expire: dayjs().add(1, 'days').unix().toString(),
      policy: formData.policy,
      signature: formData.Signature,
      accessId: formData.OSSAccessKeyId,
      host,
      dir: 'images/',
      success_action_status: '200'
    };

    return params;
  }
}
