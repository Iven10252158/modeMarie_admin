export const useDateFormatter = () => {
  const timeFormatter = (time:number) => {
    return time < 10 ? `0${time}` : `${time}`
  }
  const before7Days = new Date().getTime() - 7 * 24 * 60 * 60 * 1000
  const currentTime = new Date(Date.now())

  const year = currentTime.getFullYear()
  const month = timeFormatter(currentTime.getMonth() + 1)
  const day = timeFormatter(currentTime.getDate())

  const dateFormatter = (date:Date|string) => {
    if (typeof date === 'string') return date

    const year = date.getFullYear()
    const month = timeFormatter(date.getMonth() + 1)
    const day = timeFormatter(date.getDate())
    return `${year}-${month}-${day}`
  }

  // 開始日期為現在日期的前七天
  const startDate = () => {
    const date = new Date(before7Days)
    return `${date.getFullYear()}-${timeFormatter(date.getMonth() + 1)}-${timeFormatter(date.getDate())}`
  }

  const endDate = () => `${year}-${month}-${day}`

  return {
    startDate,
    endDate,
    dateFormatter,
    timeFormatter
  }
}
