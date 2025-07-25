import {format, isBefore, isAfter, isEqual, compareAsc, sub, differenceInCalendarDays} from 'date-fns';
import {id} from 'date-fns/locale';
import {equals} from 'class-validator';
import {PantryStatusDto} from "../dtos/pantry-status.dto";
import {StatusFormat} from "../enums/db-alias.enum";



export const capitalizeFirstLetter = (str: String) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

function generateOTP() {

}

export const FormatToIsoString = (tanggal: String | Date | string) => {
    const manualFormat = tanggal.toString().split('-').reverse().join('-');

    const normalDate = format(manualFormat, 'yyyy-MM-dd');

    return new Date(normalDate).toISOString();
};


export const GenerateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const FormatToLocaleDate = (date: Date) => {
    return format(date, 'PPP', { locale: id });
};

export const getExpiredStatus = (
    tanggal: Date,
    format: StatusFormat = StatusFormat.SIMPLE
): { status_text: string, status_color: string } => {
    const now = new Date();
    const deadline = new Date(tanggal);

    const sevenDaysBefore = sub(deadline, { days: 7 });
    const daysLeft = differenceInCalendarDays(deadline, now);

    let statusExpired = {
        status_text: "",
        status_color: "",
    };

    if (isBefore(deadline, now)) {
        // Sudah lewat deadline
        const expiredTexts = {
            [StatusFormat.SIMPLE]: "Expired",
            [StatusFormat.HEADER]: "Expired",
            [StatusFormat.DETAILED]: "This item has expired and should be disposed of safely"
        };

        statusExpired = {
            status_text: expiredTexts[format],
            status_color: "RED_TRANSPARENT",
        };
    } else if (isBefore(now, sevenDaysBefore)) {
        // Masih lebih dari 7 hari sebelum expired
        const freshTexts = {
            [StatusFormat.SIMPLE]: "Fresh",
            [StatusFormat.HEADER]: "Fresh",
            [StatusFormat.DETAILED]: "This item is perfectly Fresh"
        };

        statusExpired = {
            status_text: freshTexts[format],
            status_color: "GREEN_TRANSPARENT",
        };
    } else {
        // Akan expired dalam 7 hari
        const expiringTexts = {
            [StatusFormat.SIMPLE]: `${daysLeft} left`,
            [StatusFormat.HEADER]: `Expiring ${daysLeft} days left`,
            [StatusFormat.DETAILED]: `This item expires in ${daysLeft} days. Use it soon!`
        };

        statusExpired = {
            status_text: expiringTexts[format],
            status_color: "YELLOW_TRANSPARENT",
        };
    }

    return statusExpired;
};

