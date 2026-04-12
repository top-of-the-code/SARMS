/**
 * Utility functions for generating random test data
 */

// Generates alphabetical text ONLY (no numbers) like "Student AbCdEf"
export function generateRandomName(prefix = "Test") {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomLetters = '';
    for (let i = 0; i < 6; i++) {
        randomLetters += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix} ${randomLetters}`;
}

// Generates a random 10-digit phone number
export function generateRandomPhone() {
    return Math.floor(6000000000 + Math.random() * 4000000000).toString();
}

// Generates a random 6-digit pincode
export function generateRandomPincode() {
    return Math.floor(100000 + Math.random() * 899999).toString();
}

// Generates a random alphanumeric string for addresses/general fields
export function generateRandomString(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}