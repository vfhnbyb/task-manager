export default function (dateTimeString: string) {
    const [datePart, timePart] = dateTimeString.split(' ')
    const [day, month, year] = datePart.split('.')
    const [hours, minutes] = timePart.split(':')

    // Месяцы в JavaScript: 0-11, поэтому month - 1
    const date = new Date(year, month - 1, day, hours, minutes)

    return date.toISOString()
}
