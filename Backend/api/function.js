module.exports = app => {

    function  formatDate(date) {
        let monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        let day = date.getDate();
        let monthIndex = date.getMonth();
        let year = date.getFullYear();
        let hour = date.toString().slice(16, 24);

        return day + ' ' + monthNames[monthIndex] + ' ' + year
            + ' ' + hour;

    }

    return { formatDate }
    
};