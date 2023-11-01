export default function sanitize(input) {
    console.log("sanitized input",input.replace(/[^a-zA-Z0-9 ]/g, ''))
    return input.replace(/[^a-zA-Z0-9 ]/g, '');
}