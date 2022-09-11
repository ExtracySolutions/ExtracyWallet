/* eslint-disable no-extend-native */
import { strings } from 'I18n'
/**Extension file for Date prototype */
declare global {
  interface Date {
    getStringByFormat(format: string): string
  }
}

Date.prototype.getStringByFormat = function (format: string) {
  const secondPredicates = ['ss', 's']
  const minutePredicates = ['mm', 'm']
  const hourPredicates = ['HH', 'H']
  const datePredicates = ['dd', 'DD', 'd']
  const monthPredicates = ['M', 'MM', 'MMM', 'MONTH', 'month', 'Mth', 'mth']
  const yearPredicates = ['yy', 'yyyy', 'YY', 'YYYY']

  const monthShortNames = [
    strings('datetime.jan'),
    strings('datetime.feb'),
    strings('datetime.mar'),
    strings('datetime.apr'),
    strings('datetime.may'),
    strings('datetime.jun'),
    strings('datetime.jul'),
    strings('datetime.aug'),
    strings('datetime.sep'),
    strings('datetime.oct'),
    strings('datetime.nov'),
    strings('datetime.dec'),
  ]
  const monthNames = [
    strings('datetime.January'),
    strings('datetime.February'),
    strings('datetime.March'),
    strings('datetime.April'),
    strings('datetime.May'),
    strings('datetime.June'),
    strings('datetime.July'),
    strings('datetime.August'),
    strings('datetime.September'),
    strings('datetime.October'),
    strings('datetime.November'),
    strings('datetime.December'),
  ]
  const monthShortName = monthShortNames[this.getMonth()]
  const monthName = monthNames[this.getMonth()]

  const substrings = format.split(/[-/T:]/)

  const secondComponent = substrings.find((item) =>
    secondPredicates.some((second) => second === item),
  )
  const minuteComponent = substrings.find((item) => {
    minutePredicates.some((minute) => minute === item)
  })
  const hourComponent = substrings.find((item) =>
    hourPredicates.some((hour) => hour === item),
  )
  const dateComponent = substrings.find((item) =>
    datePredicates.some((date) => date === item),
  )
  const monthComponent = substrings.find((item) =>
    monthPredicates.some((month) => month === item),
  )
  const yearComponent = substrings.find((item) =>
    yearPredicates.some((year) => year === item),
  )

  var timeStr = ''
  timeStr = `${format}`

  //Formatting date
  if (dateComponent && dateComponent.length === 2) {
    timeStr = timeStr.replace(
      dateComponent,
      `${this.getDate() >= 10 ? this.getDate() : '0' + this.getDate()}`,
    )
  } else if (dateComponent && dateComponent.length === 1) {
    timeStr = timeStr.replace(dateComponent, `${this.getDate()}`)
  }

  //Formatting month
  let currentMonth = this.getMonth() + 1
  if (monthComponent && monthComponent.length === 5) {
    timeStr = timeStr.replace(monthComponent, monthName)
  } else if (monthComponent && monthComponent.length === 3) {
    timeStr = timeStr.replace(monthComponent, monthShortName)
  } else if (monthComponent && monthComponent.length === 2) {
    timeStr = timeStr.replace(
      monthComponent,
      `${currentMonth >= 10 ? currentMonth : '0' + currentMonth}`,
    )
  } else if (monthComponent && monthComponent.length === 1) {
    timeStr = timeStr.replace(monthComponent, `${currentMonth}`)
  }

  //Formatting year
  if (yearComponent && yearComponent.length === 2) {
    let fullYear = `${this.getFullYear()}`
    let shortYear = fullYear.slice(2, 4)
    timeStr = timeStr.replace(yearComponent, shortYear)
  } else if (yearComponent && yearComponent.length === 4) {
    timeStr = timeStr.replace(yearComponent, `${this.getFullYear()}`)
  }

  //Formatting hour
  if (hourComponent && hourComponent.length === 2) {
    timeStr = timeStr.replace(
      hourComponent,
      `${this.getHours() >= 10 ? this.getHours() : '0' + this.getHours()}`,
    )
  } else if (hourComponent && hourComponent.length === 1) {
    timeStr = timeStr.replace(hourComponent, `${this.getHours()}`)
  }

  //Formatting minute
  if (minuteComponent && minuteComponent.length === 2) {
    timeStr = timeStr.replace(
      minuteComponent,
      `${
        this.getMinutes() >= 10 ? this.getMinutes() : '0' + this.getMinutes()
      }`,
    )
  } else if (minuteComponent && minuteComponent.length === 1) {
    timeStr = timeStr.replace(minuteComponent, `${this.getMinutes()}`)
  }

  //Formatting second
  if (secondComponent && secondComponent.length === 2) {
    timeStr = timeStr.replace(
      secondComponent,
      `${
        this.getSeconds() >= 10 ? this.getSeconds() : '0' + this.getSeconds()
      }`,
    )
  } else if (secondComponent && secondComponent.length === 1) {
    timeStr = timeStr.replace(secondComponent, `${this.getSeconds()}`)
  }

  return timeStr === format ? this.toLocaleDateString() : timeStr
}
