import {format, isBefore, isAfter, isEqual, compareAsc, sub, differenceInCalendarDays} from 'date-fns';
import {id} from 'date-fns/locale';
import {equals} from 'class-validator';
import {PantryStatusDto} from "../dtos/pantry-status.dto";



export const capitalizeFirstLetter = (str: String) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

function generateOTP() {

}
export const GenerateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


export const ExpiredStatus = (tanggal: Date): PantryStatusDto => {
    const now = new Date();
    const deadline = new Date(tanggal); // pastikan ini Date, bukan string

    const sevenDaysBefore = sub(deadline, {days: 7});
    const daysLeft = differenceInCalendarDays(deadline, now);

    let statusExpired: PantryStatusDto


    if (isBefore(deadline, now)) {
        // Sudah lewat deadline
        statusExpired = {
            status_text: "Expired",
            status_color: "RED_TRANSPARENT",
        };
    } else if (isBefore(now, sevenDaysBefore)) {
        // Masih lebih dari 7 hari sebelum expired
        statusExpired = {
            status_text: "Fresh",
            status_color: "GREEN_TRANSPARENT",
        };
    } else {

        statusExpired = {
            status_text: `${daysLeft} left`,
            status_color: "YELLOW_TRANSPARENT",
        };
    }

    return statusExpired;

};




