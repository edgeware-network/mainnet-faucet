export default function (eventName, eventData) {
    if (window && window.gtag) {
        try {
            window.gtag('event', eventName, eventData);
        } catch (e) {
            console.error('LogEventUtil:', e);
        }
    } else {
        console.error('LogEventUtil: gtag not found!');
    }

}