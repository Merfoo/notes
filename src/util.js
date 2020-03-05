const emailRegx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

export const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const validateEmail = (s) => {
    return emailRegx.test(s);
};

export const getTimeAgoString = (startDate) => {
    const getPlural = (i) => i > 1 ? "s" : "";

    const now = Date.now();

    const secDiff = Math.floor((now - startDate) / 1000);

    if (secDiff < 60)
        return `${secDiff} second${getPlural(secDiff)} ago`;

    const minDiff = Math.floor(secDiff / 60);

    if (minDiff < 60)
        return `${minDiff} minute${getPlural(minDiff)} ago`;

    const hourDiff = Math.floor(minDiff / 60);

    if (hourDiff < 24)
        return `${hourDiff} hour${getPlural(hourDiff)} ago`;

    const nowDate = new Date(now);
    const yearDiff = nowDate.getFullYear() - startDate.getFullYear();
    const monthDiff = (yearDiff * 12) + (nowDate.getMonth() - startDate.getMonth());
    const dayDiff = Math.floor(hourDiff / 24);

    if (monthDiff >= 12)
        return `${yearDiff} year${getPlural(yearDiff)} ago`;

    if (dayDiff >= 30)
        return `${monthDiff} month${getPlural(monthDiff)} ago`;

    if (dayDiff > 0)
        return `${dayDiff} day${getPlural(dayDiff)} ago`;

    return "Time is not real";
};
