import moment from 'moment-timezone';

export class DateConverter {
  private static readonly TIMEZONE = 'Azia/Vientiane';

  static formatToVientianeString(
    date: Date | string | number = new Date(),
  ): string {
    return moment(date).tz(this.TIMEZONE).format();
  }
}
