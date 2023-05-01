const sendPush = async(token, title, body, data) => {

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
      },
        body: JSON.stringify({
          to: token,
          title: title,
          body: body,
          data: data,
        }),
      });
  
      const result = await response.json();
  
      if (result.errors) {
        throw new Error(`Failed to send push notification: ${result.errors}`);
      }

      return result.data;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return null;
    }
}

export default sendPush;