import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { format, isValid, parse } from "date-fns";

@ValidatorConstraint({ async: false })
export class IsDateFormatConstraint implements ValidatorConstraintInterface {
    validate(value: string): boolean {
        const parsedDate = parse(value, 'yyyy/MM/dd', new Date());
        return isValid(parsedDate) && value === format(parsedDate, 'yyyy/MM/dd');
    }

    defaultMessage(): string {
        return 'Tanggal Must be following that format yyyy/MM/dd';
    }
}

export function IsDateFormat(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsDateFormatConstraint,
        });
    };
}
