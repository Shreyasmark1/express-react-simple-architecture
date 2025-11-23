function getDaysDifference(createdAt: string, updatedAt: string) {

    const createdDate = new Date(createdAt);
    const updatedDate = new Date(updatedAt);

    const timeDifferenceMs = updatedDate.getTime() - createdDate.getTime();

    const daysDifference = timeDifferenceMs / (1000 * 60 * 60 * 24);

    return Math.floor(daysDifference);
}

const formatDate = (val: string) => {
    const date = new Date(val);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

export const DateUtil = {
    getDaysDifference,
    formatDate
}