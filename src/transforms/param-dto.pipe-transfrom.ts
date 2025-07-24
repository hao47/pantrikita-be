import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ParamDTOPipeTransform implements PipeTransform {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype) {
            return value;
        }

        return plainToInstance(metatype, value);
    }
}
