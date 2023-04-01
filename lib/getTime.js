function getTime(date) {
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (date.getTime() >= today.getTime() && date.getTime() < today.getTime() + 86400000) {
      // If the date is today's date
      let hours = date.getHours().toString().padStart(2, "0");
      let minutes = date.getMinutes().toString().padStart(2, "0");
      let suffix = hours >= 12 ? "PM" : "AM";
      
      if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours = (hours - 12).toString().padStart(2, "0");
      }
    return hours + ":" + minutes + " " + suffix;
    } else {
      // If the date is not today's date
      let month = date.toLocaleString('default', { month: 'long' });
      let day = date.getDate().toString().padStart(2, "0");
      return month + " " + day;
    }
  }

  export default getTime;