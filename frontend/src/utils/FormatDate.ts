import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function FormatDate(date: string): string {
    // Convert to IST explicitly
    const formattedDate = dayjs.utc(date).tz('Asia/Kolkata').format('DD MMMM, YYYY');
    return formattedDate;
}