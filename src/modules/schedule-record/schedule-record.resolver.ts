import { FindOptionsWhere } from 'typeorm';
import { ScheduleRecord } from './models/schedule-record.entity';
import {
  COURSE_DEL_FAIL,
  COURSE_NOT_EXIST,
} from './../../common/constants/code';
import { Result } from '@/common/dto/result.type';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { SUCCESS } from '@/common/constants/code';
import {
  ScheduleRecordResult,
  ScheduleRecordResults,
} from './dto/result-schedule-record.output';
import { ScheduleRecordType } from './dto/schedule-record.type';
import { ScheduleRecordService } from './schedule-record.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';

@Resolver(() => ScheduleRecordType)
@UseGuards(GqlAuthGuard)
export class ScheduleRecordResolver {
  constructor(private readonly scheduleRecordService: ScheduleRecordService) {}

  @Query(() => ScheduleRecordResult)
  async getScheduleRecordInfo(
    @Args('id') id: string,
  ): Promise<ScheduleRecordResult> {
    const result = await this.scheduleRecordService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: '获取成功',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: '课程信息不存在',
    };
  }

  @Query(() => ScheduleRecordResults)
  async getScheduleRecords(
    @Args('page') page: PageInput,
    @CurUserId() userId: string,
  ): Promise<ScheduleRecordResults> {
    const { pageNum, pageSize } = page;
    const where: FindOptionsWhere<ScheduleRecord> = { createdBy: userId };
    const [results, total] =
      await this.scheduleRecordService.findScheduleRecords({
        start: pageNum === 1 ? 0 : (pageNum - 1) * pageSize + 1,
        length: pageSize,
        where,
      });
    return {
      code: SUCCESS,
      data: results,
      page: {
        pageNum,
        pageSize,
        total,
      },
      message: '获取成功',
    };
  }

  @Mutation(() => Result)
  async deleteScheduleRecord(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.scheduleRecordService.findById(id);
    if (result) {
      const delRes = await this.scheduleRecordService.deleteById(id, userId);
      if (delRes) {
        return {
          code: SUCCESS,
          message: '删除成功',
        };
      }
      return {
        code: COURSE_DEL_FAIL,
        message: '删除失败',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: '门店信息不存在',
    };
  }
}
